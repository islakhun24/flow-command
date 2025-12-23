import {Request, Response} from "express";
import {fundingRateService} from "../services/fundingRate.service";

export async function FundingRatesController(
    _req: Request,
    res: Response) {

    try {
        const data = await fundingRateService(_req.query?.symbol as string);
        res.status(200).json(data)
    }catch (e) {
        res.status(500).json({
            error: e.message || "Internal error"
        })
    }
    }
