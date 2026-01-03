import express from "express"
import { getMarketSnapshot } from "../market/market.service"
import { detectSweep } from "../indicators/sweep"
import { analyzeLongShort } from "../indicators/longShort"
import { getPrePumpAnalysis, getPrePumpRankingAll } from "../controller/analysis-coin.controller"
import {prePumpScanController} from "../controller/prePump.controller";
import {PairInformationController} from "../controller/pairInformation.controller";
import {FundingRatesController} from "../controller/fundingRate.controller";
import {OpenInterestController} from "../controller/openInterest.controller";
import {LsRatioController} from "../controller/lsRatio.controller";
import {PairAnalysisController} from "../controller/pairAnalysis.controller";
import {PairTradingFilterController} from "../controller/pairTradingFilter.controller";
import trendRoutes from "./routes/trend.route";

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
    app.get("/analysis/pair/information/all", PairInformationController)

    app.get("/pair/funding-rates",FundingRatesController)
    app.get("/pair/open-interest",OpenInterestController)

    app.get("/pair/analysis", PairAnalysisController)

    // pair/ls-ratio?limit=100&interval=4h&symbol=BTCUSDT
    app.get("/pair/ls-ratio", LsRatioController)

        app.get("/pair/trading-filter", PairTradingFilterController)

    app.use("/trend", trendRoutes)

    app.listen(port, () => {
        console.log(`Flow-Command API running on port ${port}`)
    })
}
