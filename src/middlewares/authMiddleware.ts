import type { NextFunction, Request, Response } from "express";
import ApiErrors from "~/exceptions/apiErrors.js";
import tokenService from "~/service/tokenService.js";

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiErrors.UnauthorizedError());
    }
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiErrors.UnauthorizedError());
    }
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiErrors.UnauthorizedError());
    }
    next();
  } catch (e) {
    return next(ApiErrors.UnauthorizedError());
  }
}