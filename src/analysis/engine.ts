import { Trend } from "./cvd"
import { getMarketCapClass, weight } from "./marketCap"

export type MarketState = "PRE_PUMP" | "NEUTRAL" | "DISTRIBUTION"
export type RawStatus =
    | "WAIT"
    | "ACCUMULATION"
    | "SETUP_ENTRY"
    | "BREAKOUT_WATCH"
    | "OVERHEATED"
    | "DISTRIBUTION"

export interface EngineInput {
    symbol: string
    marketCapUsd: number
    spot?: { cvdTrend: Trend; absorption: boolean }
    futures: {
        oiChangePct: number
        fundingRate: number
        cvdTrend: Trend
        ls: { global: number; topAccount: number; topPosition: number }
    }
    price: { atrCompression: boolean; priceEfficiency: number }
}

export function runPrePumpEngine(input: EngineInput) {
    const flags: string[] = []
    const cls = getMarketCapClass(input.marketCapUsd)
    flags.push(`MCAP_${cls}`)

    let score = 0

    // ATR
    if (input.price.atrCompression)
        score += 2 * weight.atr[cls]

    // Spot
    const spotDominant =
        input.spot &&
        input.spot.cvdTrend === "UP" &&
        input.spot.absorption
    if (spotDominant)
        score += 2 * weight.spot[cls]

    // Funding
    if (input.futures.fundingRate <= 0.01)
        score += 1 * weight.derivatives[cls]

    // LS
    const { global, topAccount, topPosition } = input.futures.ls
    let lsScore = 0
    if (global > 1.6) lsScore -= 1
    if (global > 1.6 && topAccount < 0.8 && topPosition < 0.8) lsScore -= 1.5
    if (topAccount > 1.2 && topPosition > 1.2 && global < 1.6) lsScore += 1
    score += lsScore * weight.ls[cls]

    // Distribution
    const priceEffWeighted = input.price.priceEfficiency * weight.priceEff[cls]
    const distributionRisk =
        input.futures.fundingRate > 0.02 && priceEffWeighted > 3

    let marketState: MarketState = "NEUTRAL"
    if (distributionRisk) marketState = "DISTRIBUTION"
    else if (score >= 4) marketState = "PRE_PUMP"

    // Raw Status
    let rawStatus: RawStatus = "WAIT"
    if (marketState === "DISTRIBUTION") rawStatus = "DISTRIBUTION"
    else if (input.futures.fundingRate > 0.02) rawStatus = "OVERHEATED"
    else if (marketState === "PRE_PUMP" && spotDominant && input.price.atrCompression)
        rawStatus = "SETUP_ENTRY"
    else if (marketState === "PRE_PUMP" && input.price.atrCompression)
        rawStatus = "ACCUMULATION"

    return {
        symbol: input.symbol,
        marketCapUsd: input.marketCapUsd,
        marketCapClass: cls,
        marketState,
        rawStatus,
        rawScore: Number(score.toFixed(2)),
        flags
    }
}
