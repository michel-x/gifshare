import express, { Request, Response } from 'express';
import Joi from 'joi';
import { db } from '../../services/firebase';
import { NotFoundError } from '../../errors/not-found-error';
import { Collections, Gif } from '../../services/models';
import { params } from '../../middlewares/validate-request';
import { computeFile } from '../../services/file';

const router = express.Router();

router.get(
    '/public/:token',
    params({ 
        token: Joi.string().required(),
    }),
    async (request: Request, response: Response) => {
        const token = request.params.token;
        const fileSnaps = await db.collection(Collections.Gifs).where('token', '==', token).limit(1).get();
        if (fileSnaps.empty) { 
            throw new NotFoundError();
        }
        const fileSnap = fileSnaps.docs[0];
        let file = { ...fileSnap.data(), id: fileSnap.id } as Gif;
        file = await computeFile(file);

        response.redirect(302, file.url?.value!);
    }
);

export { router as publicFileRouter };