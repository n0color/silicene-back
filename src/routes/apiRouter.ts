import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express'
import { auth, login } from '../controllers/authController.js';
const router = Router();

router.get('/auth', auth);
router.get('/login', login);

export { router as apiRouter };