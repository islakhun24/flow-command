import {
    getKlines,
    getFundingRate,
    getOpenInterest,
    getAllFuturesSymbols,
    getNotionalOpenInterest, getAllFuturesSymbols
} from "../market/binance.client"
import { runPrePumpEngine } from "../engine/prePump.engine"
import {runWithLimit} from "../utils/concurrency";

export async function buildPrePumpAnalysis(
    symbol: string,
    tf: string
) {
    const klines = await getKlines(symbol, tf)
    const funding = await getFundingRate(symbol)
    const oi = await getOpenInterest(symbol)

    return runPrePumpEngine({
        symbol,
        timeframe: tf,
        klines,
        funding,
        openInterest: oi
    })
}

function assignTierByPercentile(
    score: number,
    sortedScores: number[]
) {
    const idx = sortedScores.findIndex(s => s === score)
    const percentile = idx / sortedScores.length

    if (percentile <= 0.15) return "A"   // top 15%
    if (percentile <= 0.35) return "B"   // next 20%
    return "C"
}

export async function buildPrePumpRankingAll() {
    const symbols = await getAllFuturesSymbols()
    const results: any[] = []

    await runWithLimit(symbols, 3, async (symbol) => {
        try {
            const klines = await getKlines(symbol, "4h", 20)
            const funding = await getFundingRate(symbol)
            const oiHist = await getNotionalOpenInterest(symbol)

            const analysis = runPrePumpEngine({
                symbol,
                klines,
                funding,
                oiHist
            })

            if (analysis) {
                results.push(analysis)
            }
        } catch {}
    })

    // =========================
    // 🔥 RELATIVE RANKING
    // =========================
    const scores = results.map(r => r.ranking.score)
    const sorted = [...scores].sort((a, b) => b - a)

    for (const r of results) {
        r.ranking.tier =
            assignTierByPercentile(
                r.ranking.score,
                sorted
            )

        // optional: normalized score 0–1
        const max = sorted[0]
        const min = sorted[sorted.length - 1]
        r.ranking.relative_score =
            max === min
                ? 0
                : (r.ranking.score - min) / (max - min)
    }

    return {
        timeframe: "4H",
        window: 20,
        total_scanned: symbols.length,
        total_results: results.length,
        results: results
            .filter(r => r.market_state === "PRE_PUMP")
            .sort(
                (a, b) =>
                    b.ranking.relative_score -
                    a.ranking.relative_score
            )
    }
}
