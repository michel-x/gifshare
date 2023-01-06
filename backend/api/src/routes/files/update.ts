import express, { Request, Response } from 'express';
import Joi from 'joi';
import { DateTime } from 'luxon';
import { NotAuthorizedError } from '../../errors/not-authorized-error';
import { NotFoundError } from '../../errors/not-found-error';
import { requireAuth } from '../../middlewares/require-auth';
import { db, storage } from '../../services/firebase';
import { Collections, Gif } from '../../services/models';
import { body, params } from '../../middlewares/validate-request';

const router = express.Router();

router.put(
    '/:fileId',
    requireAuth,
    body({
        name: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).required(),
    }),
    params({ 
        fileId: Joi.string().required(),
    }),
    async (request: Request, response: Response) => {
        const fileId = request.params.fileId;
        const { name, tags } : { name: string, tags: string[] } = request.body;
        const fileSnap = await db.collection(Collections.Gifs).doc(fileId).get();

        if (!fileSnap.exists) { 
            throw new NotFoundError();
        }
        
        const file = { ...fileSnap.data(), id: fileSnap.id } as Gif;

        if (file.owner !== request.currentUser!.uid) {
            throw new NotAuthorizedError();
        }

        await storage.bucket().file(file.path).setMetadata({
            contentDisposition: `inline; filename="${name}"`,
        });
        await db.collection(Collections.Gifs).doc(fileId).set({
            tags,
            name,
            updatedAt: DateTime.utc().toISO(),
        } as Partial<Gif>,  { merge: true });

        const data = {
            id: file.id,
            name,
            tags,
            url: file.url?.value,
        };

        return response.status(200).json({ data });
    }
);

export { router as updateRouter };