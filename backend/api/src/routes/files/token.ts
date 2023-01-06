import express, { Request, Response } from 'express';
import Joi from 'joi';
import { DateTime } from 'luxon';
import { NotFoundError } from '../../errors/not-found-error';
import { NotAuthorizedError } from '../../errors/not-authorized-error';
import { requireAuth } from '../../middlewares/require-auth';
import { db } from '../../services/firebase';
import { Collections, Gif } from '../../services/models';
import { params } from '../../middlewares/validate-request';
import { generateRandomString } from '../../services/utils';

const router = express.Router();

router.post(
    '/:fileId/public',
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

        const token = await generateRandomString(100);
        await db.collection(Collections.Gifs).doc(fileId).set({
            token,
            updatedAt: DateTime.utc().toISO(),
        } as Partial<Gif>, { merge: true });

        const data = {
            id: file.id,
            name: file.name,
            tags: file.tags,
            token,
            url: file.url?.value,
        };

        return response.status(200).json({ data });
    }
);

export { router as generateTokenRouter };