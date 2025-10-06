import type { Request, Response } from 'express';

export function auth(req: Request, res: Response): void {
  res.status(200).json({ status: 'ok' });
}

export function login(req: Request, res: Response): void {
  res.status(501).json({ error: 'Not implemented' });
}
