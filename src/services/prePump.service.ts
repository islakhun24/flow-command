
import { analyzePrice } from "../analysis/price"
import { calcCVDTrend } from "../analysis/cvd"
import { runPrePumpEngine } from "../analysis/engine"
import {fetchMarketCaps, getMarketCapUsd} from "../market/coingecko.client";
import {
    getAllFuturesSymbols,
    getFundingRate, getKlines,
    getLSRetail,
    getLSTopTrader,
    getLSTopTraderAccount, getNotionalOpenInterest,
    getOpenInterest
} from "../market/binance.client";
import {getSpotTrades} from "../market/binance-spot.client";
import {runWithLimit} from "../utils/concurrency";

export async function prePumpScan() {
    const symbols = await getAllFuturesSymbols()
    const results: any[] = []

    await runWithLimit(symbols, 3, async (symbol) => {
        try {
            try {
                const marketCapUsd = await getMarketCapUsd(symbol)

                const [
                    funding,
                    oiHist,
                    lsGlobal,
                    lsTopAcc,
                    lsTopPos,
                    klines
                ] = await Promise.all([
                    getFundingRate(symbol),
                    getOpenInterest(symbol),
                    getLSRetail(symbol),
                    getLSTopTraderAccount(symbol),
                    getLSTopTrader(symbol),
                    getKlines(symbol)
                ])

                const oiChangePct =
                    ((oiHist[1] - oiHist[0]) / oiHist[0]) * 100

                const price = analyzePrice(klines, oiChangePct)

                let spot
                try {
                    const trades = await getSpotTrades(symbol)
                    const cvd = calcCVDTrend(trades)
                    spot = { cvdTrend: cvd, absorption: cvd === "UP" }
                } catch {}

                const result = runPrePumpEngine({
                    symbol,
                    marketCapUsd,
                    spot,
                    futures: {
                        oiChangePct,
                        fundingRate: funding,
                        cvdTrend: "FLAT",
                        ls: {
                            global: lsGlobal,
                            topAccount: lsTopAcc,
                            topPosition: lsTopPos
                        }
                    },
                    price
                })

                results.push(result)
            } catch {}
        } catch {}
    })
    return {
        timeframe: "4H",
        window: 20,
        generated_at: new Date().toISOString(),
        total_scanned: results.length,
        results
    }
}
