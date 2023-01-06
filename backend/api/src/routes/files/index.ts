import express from 'express';
import { searchRouter } from './search';
import { createRouter } from './create';
import { updateRouter } from './update';
import { deleteRouter } from './delete';
import { generateTokenRouter } from './token';
import { publicFileRouter } from './public';

const router = express.Router();

router.use(searchRouter);
router.use(publicFileRouter);
router.use(createRouter);
router.use(updateRouter);
router.use(deleteRouter);
router.use(generateTokenRouter);

export { router as filesRouter };