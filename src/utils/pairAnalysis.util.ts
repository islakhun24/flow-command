import { Bias, EngineInput, MarketState } from "../types/pairAnalysis.type"
import {
    AggregateTradeBinanceResponse,
    FundingRateBinanceResponse,
    KlineBinanceResponse,
    LSBinanceResponse,
    OIBinanceResponse,
    OrderBookBinanceResponse
} from "../types/binance.type"

/* =======================
   BASIC HELPERS
======================= */
export const pctChange = (prev: number, curr: number) =>
    ((curr - prev) / Math.abs(prev)) * 100

export const avg = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0

export const last = <T>(arr: T[]) => arr[arr.length - 1]
export const prev = <T>(arr: T[]) => arr[arr.length - 2]

export const lastN = <T>(arr: T[], n = 20): T[] =>
    arr.slice(Math.max(arr.length - n, 0))

export const toNum = (v: string | number) => Number(v)

/* =======================
   MARKET METRICS
======================= */
export const cvd = (buy: number[], sell: number[]) =>
    buy.reduce((a, b) => a + b, 0) - sell.reduce((a, b) => a + b, 0)

export const atr = (high: number[], low: number[]) =>
    avg(high.map((h, i) => h - low[i]))

/* =======================
   MARKET STATE
======================= */
export function detectMarketState(input: EngineInput): MarketState {
    const oiDelta = pctChange(prev(input.oiData), last(input.oiData))
    const fundingAvg = avg(input.fundingRateData)
    const priceDelta = pctChange(prev(input.klineClose), last(input.klineClose))
    const cvdValue = cvd(input.tradesAggBuyVol, input.tradesAggSellVol)
    const atrValue = atr(input.klineHigh, input.klineLow)

    // DOMINANT → trend continuation
    if (
        Math.abs(oiDelta) > 3 &&
        Math.abs(fundingAvg) > 0.01 &&
        Math.abs(priceDelta) > 1
    ) {
        return MarketState.DOMINANT
    }

    // FLUSH → liquidation / stop hunt
    if (
        oiDelta < -2 &&
        Math.abs(priceDelta) > 1 &&
        Math.sign(priceDelta) !== Math.sign(fundingAvg)
    ) {
        return MarketState.FLUSH
    }

    // REBUILD → accumulation after flush
    if (
        oiDelta > 1 &&
        Math.abs(fundingAvg) < 0.01 &&
        Math.abs(priceDelta) < 1 &&
        Math.abs(cvdValue) > 0
    ) {
        return MarketState.REBUILD
    }

    return MarketState.FLAT
}

/* =======================
   BIAS DETECTION
======================= */
export function detectBias(input: EngineInput): Bias {
    const topPos = last(input.topPositionRatioData)
    const topAcc = last(input.topAccountRatioData)
    const funding = avg(input.fundingRateData)

    if (topPos > 0.55 && topAcc > 0.55 && funding <= 0.01) {
        return Bias.LONG
    }

    if (topPos < 0.45 && topAcc < 0.45 && funding >= -0.01) {
        return Bias.SHORT
    }

    return Bias.NONE
}

/* =======================
   ENTRY CONFIRMATION
======================= */
export function entryConfirmation(
    bias: Bias,
    input: EngineInput
): boolean {
    const bidAskRatio =
        input.orderBookBidVol / (input.orderBookAskVol + 1)

    const cvdValue = cvd(input.tradesAggBuyVol, input.tradesAggSellVol)

    if (bias === Bias.LONG) {
        return bidAskRatio > 1.15 && cvdValue > 0
    }

    if (bias === Bias.SHORT) {
        return bidAskRatio < 0.85 && cvdValue < 0
    }

    return false
}

/* =======================
   CONFIDENCE SCORE
======================= */
export function calcConfidence(
    bias: Bias,
    state: MarketState,
    input: EngineInput
): number {
    let score = 0.5

    const oiDelta = Math.abs(
        pctChange(prev(input.oiData), last(input.oiData))
    )
    const fundingAbs = Math.abs(avg(input.fundingRateData))
    const cvdValue = cvd(input.tradesAggBuyVol, input.tradesAggSellVol)

    if (state === MarketState.DOMINANT) score += 0.15
    if (state === MarketState.REBUILD) score += 0.15

    if (oiDelta > 3) score += 0.1
    if (fundingAbs < 0.01) score += 0.05

    if (bias === Bias.LONG && cvdValue > 0) score += 0.1
    if (bias === Bias.SHORT && cvdValue < 0) score += 0.1

    return Math.min(score, 0.95)
}

/* =======================
   PARSERS
======================= */
export function parseOI(data: OIBinanceResponse[]): number[] {
    return lastN(data).map(d => toNum(d.sumOpenInterest))
}

export function parseLSRatio(data: LSBinanceResponse[]): number[] {
    return lastN(data).map(d => toNum(d.longShortRatio))
}

export function parseFunding(data: FundingRateBinanceResponse[]): number[] {
    return lastN(data).map(d => toNum(d.fundingRate))
}

export function parseKline(data: KlineBinanceResponse[]) {
    const sliced = lastN(data)
    return {
        close: sliced.map(k => k.close),
        high: sliced.map(k => k.high),
        low: sliced.map(k => k.low)
    }
}

export function parseAggTrades(data: AggregateTradeBinanceResponse[]) {
    const sliced = lastN(data)

    const buyVol: number[] = []
    const sellVol: number[] = []

    for (const t of sliced) {
        const qty = toNum(t.q)
        t.m ? sellVol.push(qty) : buyVol.push(qty)
    }

    return { buyVol, sellVol }
}

export function parseOrderBook(ob: OrderBookBinanceResponse) {
    const bidVol = ob.bids.reduce((s, [_, q]) => s + toNum(q), 0)
    const askVol = ob.asks.reduce((s, [_, q]) => s + toNum(q), 0)

    return { bidVol, askVol }
}
