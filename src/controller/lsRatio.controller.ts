import {Request, Response} from "express";
import {HttpStatusCode, ResponseHelper} from "../common/response";
import {LsRatioService} from "../services/lsRatio.service";

export async function LsRatioController(_req: Request, res: Response) {
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

        const data = await LsRatioService(params?.symbol, params?.interval, params?.limit)

        res.status(HttpStatusCode.OK).json(ResponseHelper.ok(data))
    }
