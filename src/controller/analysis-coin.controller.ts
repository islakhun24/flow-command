import { Request, Response } from "express"
import { buildPrePumpAnalysis, buildPrePumpRankingAll } from "../services/analysis-coin.service"

export async function getPrePumpAnalysis(req: Request, res: Response) {
    const { symbol, tf = "4h" } = req.query

    if (!symbol) {
        return res.status(400).json({ error: "symbol is required" })
    }

    const result = await buildPrePumpAnalysis(
        String(symbol),
        String(tf)
    )

    return res.json(result)
}

export async function getPrePumpRankingAll(
    _req: Request,
    res: Response
) {
    const data = await buildPrePumpRankingAll()
    res.json(data)
}
