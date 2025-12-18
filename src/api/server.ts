import express from "express"
import { getMarketSnapshot } from "../market/market.service"
import { detectSweep } from "../indicators/sweep"
import { analyzeLongShort } from "../indicators/longShort"
import { getPrePumpAnalysis, getPrePumpRankingAll } from "../controller/analysis-coin.controller"
import {prePumpScanController} from "../controller/prePump.controller";

export function startServer() {
    const app = express()
    const port = process.env.PORT || 3000

    app.use(express.json())

    app.get("/health", (_, res) => {
        res.json({ status: "ok" })
    })

    app.get("/debug/:symbol", async (req, res) => {
        const data = await getMarketSnapshot(req.params.symbol.toUpperCase())
        res.json(data)
    })

    app.get("/analysis/pre-pump", getPrePumpAnalysis)
    app.get("/analysis/pre-pump/rank/all2", getPrePumpRankingAll)
    app.get("/analysis/pre-pump/rank/all", prePumpScanController)

    app.listen(port, () => {
        console.log(`Flow-Command API running on port ${port}`)
    })
}
