import express, { Request, Response } from 'express';
import Joi from 'joi';
import { NotFoundError } from '../../errors/not-found-error';
import { NotAuthorizedError } from '../../errors/not-authorized-error';
import { requireAuth } from '../../middlewares/require-auth';
import { db, storage } from '../../services/firebase';
import { Collections, Gif } from '../../services/models';
import { params } from '../../middlewares/validate-request';

const router = express.Router();

router.delete(
    '/:fileId',
    requireAuth,
    params({ 
        fileId: Joi.string().required(),
    }),
    async (request: Request, response: Response) => {
        const fileId = request.params.fileId;
        const fileSnap = await db.collection(Collections.Gifs).doc(fileId).get();
        
        if (!fileSnap.exists) {
            throw new NotFoundError();
        }

        const file = { ...fileSnap.data(), id: fileSnap.id } as Gif;

        if (file.owner !== request.currentUser!.uid) {
            throw new NotAuthorizedError();
        }

        await storage.bucket().file(file.path).delete({ ignoreNotFound: true });
        await db.collection(Collections.Gifs).doc(fileId).delete();

        const data = {
            id: file.id,
        };

        return response.status(200).json({ data });
    }
);

export { router as deleteRouter };