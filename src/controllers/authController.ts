import type { Request, Response, NextFunction } from 'express';
import prisma from '~/utils/prisma.js';
import userService from '~/service/userService.js';
import ApiErrors from '~/exceptions/apiErrors.js';
import { validationResult } from 'express-validator';
class AuthController {
   async auth(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiErrors.BadRequest('Ошибка при валидации', errors.array()));
      }
      const { login, password } = req.body;
      const userData = await userService.registration(login, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);

    } catch (e) {
      next(e);
    }
  }
  
  async login(req: Request, res: Response, next: NextFunction): Promise<any>  {
    try { 
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiErrors.BadRequest('Ошибка при валидации', errors.array()));
      }
      const { login, password } = req.body;
      const userData = await userService.login(login, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);
    }
    catch (e) {
      next(e);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction): Promise<any>  {
    try { 
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    }
    catch (e) {
      next(e);
    }
  }
  async refresh(req: Request, res: Response, next: NextFunction): Promise<any>  {
    try { 
      const user_id = req.body;
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);
    }
    catch (e) {
      next(e);
    }
  }
}

export default new AuthController();