import {Request, Response} from "express";
import {fundingRateService} from "../services/fundingRate.service";
import {openInterestService} from "../services/openInterest.service";
import {HttpStatusCode, ResponseHelper} from "../common/response";

export async function OpenInterestController(
    _req: Request,
    res: Response) {


    try {
        if(!_req?.query?.limit){
            res.status(HttpStatusCode.BAD_REQUEST).json(ResponseHelper.badRequest("limit is required"));
            return
        }
        if(!_req?.query?.interval){
            res.status(HttpStatusCode.BAD_REQUEST).json(ResponseHelper.badRequest("interval is required"));
            return
        }
        if(!_req?.query?.symbol){
            res.status(HttpStatusCode.BAD_REQUEST).json(ResponseHelper.badRequest("symbol is required"));
            return
        }

        const params = {
            limit: _req?.query?.limit as number,
            symbol: _req?.query?.symbol as string,
            interval: _req?.query?.interval as string
        }

        const data = await openInterestService(params?.symbol, params?.interval, params?.limit);
        res.status(200).json(data)
    }catch (e) {
        res.status(500).json({
            error: e.message || "Internal error"
        })
    }
}
