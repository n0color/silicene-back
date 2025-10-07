import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express'
import { body } from 'express-validator';

import authController from '~/controllers/authController.js';
import userController from '~/controllers/userController.js';
import authMiddleware from '~/middlewares/authMiddleware.js';

const router = Router();

router.post('/auth', 
  body('login').isString().isLength({ min: 3, max: 32 }), 
  body('password').isString().isLength({ min: 8, max: 32 }), 
  authController.auth);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refresh);

router.get('/test', authMiddleware, userController.getAllUsers);

export { router as apiRouter };