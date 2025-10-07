import type { Request, Response, NextFunction } from 'express';
import userService from '~/service/userService.js';
import prisma from '~/utils/prisma.js';

class UserController {
   async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const users = await userService.getAllUsers();
        res.json({all: users});
      } catch (error) {
        console.log(error);
      }
  }

}

export default new UserController();