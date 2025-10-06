import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express'
import __dirname from '../../__dirname.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).sendFile(__dirname + '/corner/corner.html');
});
router.get('/logo.svg', (req: Request, res: Response) => {
  res.status(200).sendFile(__dirname + '/corner/logo.svg');
});

export {router as cornerRouter};