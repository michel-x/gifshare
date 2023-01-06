import express, { Request, Response } from 'express';
import { requireAuth } from '../../middlewares/require-auth';
import { db } from '../../services/firebase';
import { Collections, Gif } from '../../services/models';
import { computeFile } from '../../services/file';

const router = express.Router();

router.get(
    '/',
    requireAuth,
    async (request: Request, response: Response) => {
        const results = await db.collection(Collections.Gifs)
            .where('owner', '==', request.currentUser!.uid)
            .get();
            
        let files = results.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Gif[];
        files = await Promise.all(files.map(file => computeFile(file)));

        const data = files.map((file) => ({
            id: file.id,
            name: file.name,
            tags: file.tags,
            url: file.url?.value,
            token: file.token
        }));

        return response.status(200).json({ data });
    }
);

export { router as searchRouter };