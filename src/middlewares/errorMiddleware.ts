import type { NextFunction } from "express";
import type { Request, Response } from "express";
import ApiErrors from "~/exceptions/apiErrors.js";

export default function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  console.log(err);
  if (err instanceof ApiErrors) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: 'Неизвестная ошибка' });
}