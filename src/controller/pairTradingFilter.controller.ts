import {Request, Response} from "express";
import {PairTradingFilterService} from "../services/pairTradingFilter.service";
import {HttpStatusCode, ResponseHelper} from "../common/response";

export async function PairTradingFilterController(
    _req: Request,
    res: Response) {
    try {
        const pairTradingFilter = await PairTradingFilterService();
        res.status(HttpStatusCode.OK).json(ResponseHelper.ok(pairTradingFilter))
    }catch (e) {
        res.status(HttpStatusCode.OK).json(ResponseHelper.ok(e))
    }
    }
