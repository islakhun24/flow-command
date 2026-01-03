import { Router } from "express";
import {getSMCTrend} from "../../controller/trend.controller";

const router = Router();

router.get("/smc/:symbol", getSMCTrend);

export default router
