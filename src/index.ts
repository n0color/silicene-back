import type { Express, Request, Response, NextFunction } from 'express'
import express from 'express';
import { config } from 'dotenv';

import { backRouter } from './routes.js';

export default function buildApp(): Express {
  config();
  const app = express();

  app.use(express.json());
  app.use('/', backRouter)
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  return app;
}