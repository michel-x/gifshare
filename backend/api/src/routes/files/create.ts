import express, { Request, Response } from 'express';
import { DateTime } from 'luxon';
import Busboy from 'busboy';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import { requireAuth } from '../../middlewares/require-auth';
import { storage } from '../../services/firebase';
import { db } from '../../services/firebase';
import { Collections, Gif } from '../../services/models';

const router = express.Router();

router.post(
    '/',
    requireAuth,
    async (request: Request, response: Response) => {
        const busboy = Busboy({
            headers: request.headers,
            limits: {
                fileSize: 10 * 1024 * 1024,
            }
        });
        const tmpdir = os.tmpdir();
        const uploads: Record<string, string> = {};
        const fileWrites: Promise<any>[] = [];
        let mimetype = "";
        busboy.on('file', (fieldname, file, info) => {
            const { filename, mimeType } = info;
            mimetype = mimeType;
            const filepath = path.join(tmpdir, filename);
            uploads[filename] = filepath;

            const writeStream = fs.createWriteStream(filepath);
            file.pipe(writeStream);

            const promise = new Promise((resolve, reject) => {
                file.on('end', () => {
                    writeStream.end();
                });
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });
            fileWrites.push(promise);
        });

        busboy.on('finish', async () => {
            await Promise.all(fileWrites);

            for (const filename in uploads) {
                const fileIdentifier = v4();
                const filePath = `${request.currentUser!.uid}/${fileIdentifier}.gif`;
                await storage.bucket().upload(uploads[filename], {
                    destination: filePath,
                });
                await storage.bucket().file(filePath).setMetadata({
                    cacheControl: 'public, max-age=1600',
                    contentType: mimetype,
                    contentDisposition: `inline; filename="${filename}"`,
                });

                await db.collection(Collections.Gifs).add({
                    tags: [],
                    name: filename,
                    path: filePath,
                    owner: request.currentUser!.uid,
                    createdAt: DateTime.utc().toISO(),
                    updatedAt: DateTime.utc().toISO(),
                } as Partial<Gif>);

                fs.unlinkSync(uploads[filename]);
            }
            response.status(200).json({ message: 'Success' });
        });

        request.pipe(busboy);
    }
);

export { router as createRouter };