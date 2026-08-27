import { Router, type IRouter } from "express";
import healthRouter from "./health";
import kaushalyaRouter from "./kaushalya";

const router: IRouter = Router();

router.use(healthRouter);
router.use(kaushalyaRouter);

export default router;
