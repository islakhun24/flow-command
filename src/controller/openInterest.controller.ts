import {Request, Response} from "express";
import {fundingRateService} from "../services/fundingRate.service";
import {openInterestService} from "../services/openInterest.service";

export async function OpenInterestController(
    _req: Request,
    res: Response) {

    try {
        const data = await openInterestService(_req.query?.symbol as string, _req.query?.interval as string);
        res.status(200).json(data)
    }catch (e) {
        res.status(500).json({
            error: e.message || "Internal error"
        })
    }
}
