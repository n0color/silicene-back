import type { Express, Request, Response, NextFunction } from 'express'
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';

import { backRouter } from './routes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
export default function buildApp(): Express {
  config();
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors());
  app.use('/', backRouter);
  app.use(errorMiddleware);
  return app;
}