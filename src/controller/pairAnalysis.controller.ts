import {Request, Response} from "express";
import {HttpStatusCode, ResponseHelper} from "../common/response";
import {openInterestService} from "../services/openInterest.service";
import {pairAnalysisService} from "../services/pairAnalysis.service";
import {getAllFuturesSymbols, getFundingRate, getKlines, getNotionalOpenInterest} from "../market/binance.client";
import {runWithLimit} from "../utils/concurrency";
import {runPrePumpEngine} from "../engine/prePump.engine";

export async function PairAnalysisController(
    _req: Request,
    res: Response) {


    try {
        if (!_req?.query?.limit) {
            res.status(HttpStatusCode.BAD_REQUEST).json(ResponseHelper.badRequest("limit is required"));
            return
        }
        if (!_req?.query?.interval) {
            res.status(HttpStatusCode.BAD_REQUEST).json(ResponseHelper.badRequest("interval is required"));
            return
        }
        if (!_req?.query?.symbol) {
            res.status(HttpStatusCode.BAD_REQUEST).json(ResponseHelper.badRequest("symbol is required"));
            return
        }

        const params = {
            limit: _req?.query?.limit as number,
            symbol: _req?.query?.symbol as string,
            interval: _req?.query?.interval as string
        }

        const symbols = (await getAllFuturesSymbols()).slice(0,1)
        const results: any[] = []
        await runWithLimit(symbols, 3, async (symbol) => {
            try {

                const data = await pairAnalysisService(symbol, params?.interval, params?.limit);

                if (data) {
                    results.push(data)
                }
            } catch {
                console.log("Error in pairAnalysisController: ", symbol)
            }
        })

        res.status(200).json(results.sort(
            (a, b) => b.confidence - a.confidence
        ))
    }catch (e) {
        res.status(500).json({
            error: e.message || "Internal error"
        })
    }
}
