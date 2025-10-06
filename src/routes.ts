import { Router } from "express";

import { cornerRouter } from "./routes/cornerRouter.js";
import { apiRouter } from "./routes/apiRouter.js";

export const backRouter = Router();

backRouter.use('/', cornerRouter);
backRouter.use('/api', apiRouter);
