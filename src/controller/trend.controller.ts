import { Request, Response } from "express";
import {getSMCService} from "../services/trend.service";


export async function getSMCTrend(req: Request, res: Response) {
    const symbol = req.params.symbol.toUpperCase();
    const data = await getSMCService(symbol);
    res.json(data);
}
