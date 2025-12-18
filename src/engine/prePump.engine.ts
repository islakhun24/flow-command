type Candle = {
    open: number
    high: number
    low: number
    close: number
    volume: number
}

function mapKlines(klines: any[]): Candle[] {
    return klines.map(k => ({
        open: Number(k[1]),
        high: Number(k[2]),
        low: Number(k[3]),
        close: Number(k[4]),
        volume: Number(k[5])
    }))
}

function tr(c: Candle, p: Candle) {
    return Math.max(
        c.high - c.low,
        Math.abs(c.high - p.close),
        Math.abs(c.low - p.close)
    )
}

function atr(candles: Candle[]) {
    if (candles.length < 2) return 0
    let sum = 0
    for (let i = 1; i < candles.length; i++) {
        sum += tr(candles[i], candles[i - 1])
    }
    return sum / (candles.length - 1)
}

export function runPrePumpEngine(input: any) {
    try {
        if (
            !input ||
            !Array.isArray(input.klines) ||
            input.klines.length < 20 ||
            !Array.isArray(input.oiHist) ||
            input.oiHist.length < 2
        ) {
            return null
        }

        const fundingRate =
            typeof input.funding === "number"
                ? input.funding
                : Number(input.funding?.fundingRate ?? 0)

        if (
            input.funding?.symbol &&
            input.funding.symbol !== input.symbol
        ) {
            return null
        }

        const candles = mapKlines(input.klines)
        const closes = candles.map(c => c.close)
        const volumes = candles.map(c => c.volume)

        const priceNow = closes.at(-1)!
        const priceStart = closes[0]
        const priceChangePct =
            ((priceNow - priceStart) / priceStart) * 100

        const atr20 = atr(candles)
        const atr5 = atr(candles.slice(-5))
        const atrCompression = atr20 > 0 && atr5 < atr20 * 0.7
        const atrExpansion = atr20 > 0 && atr5 > atr20 * 1.3

        const lastIdx = input.oiHist.length - 1
        const oiNow = input.oiHist[lastIdx].notional
        const oiPrev = input.oiHist[lastIdx - 1].notional
        const notionalChangePct =
            ((oiNow - oiPrev) / oiPrev) * 100

        const totalVolume =
            volumes.reduce((a, b) => a + b, 0)

        const oiEfficiency =
            totalVolume > 0
                ? notionalChangePct / totalVolume
                : 0

        const priceEfficiency =
            Math.abs(priceChangePct) /
            Math.max(Math.abs(notionalChangePct), 1)

        const distributionRisk =
            notionalChangePct < 0 &&
            Math.abs(priceChangePct) < 1 &&
            atrCompression

        // =========================
        // RAW SCORE (HUMAN LOGIC)
        // =========================
        const rawScore =
            (atrCompression ? 3 : 0) +
            (fundingRate <= 0.01 ? 1 : 0) +
            (priceEfficiency < 0.15 ? 2 : 0)

        // =========================
        // RANKING SCORE (ABSOLUTE)
        // =========================
        let rankingScore =
            Math.min(notionalChangePct / 30, 1) * 0.4 +
            Math.min(oiEfficiency / 2, 1) * 0.3 +
            (atrCompression ? 0.2 : 0) +
            (priceEfficiency < 0.15 ? 0.1 : 0)

        if (distributionRisk) rankingScore *= 0.5
        if (atrExpansion && fundingRate > 0)
            rankingScore *= 0.7

        // ❗ CLAMP ANTI NEGATIF
        rankingScore = Math.max(0, rankingScore)

        return {
            symbol: input.symbol,
            market_state:
                rawScore >= 4 && !distributionRisk
                    ? "PRE_PUMP"
                    : distributionRisk
                        ? "DISTRIBUTION"
                        : "NEUTRAL",
            metrics: {
                notional_oi_change_pct: +notionalChangePct.toFixed(2),
                price_efficiency: +priceEfficiency.toFixed(4),
                atr_compression: atrCompression,
                funding_rate: fundingRate
            },
            ranking: {
                score: rankingScore,
                raw_score: rawScore
            }
        }

    } catch {
        return null
    }
}
