import { Router, type IRouter } from "express";
import healthRouter from "./health";
import passwordsRouter from "./passwords";

const router: IRouter = Router();

router.use(healthRouter);
router.use(passwordsRouter);

export default router;
