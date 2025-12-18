type Candle = {
    open: number
    high: number
    low: number
    close: number
}

function mapKlines(klines: any[]): Candle[] {
    return klines.map(k => ({
        open: +k[1],
        high: +k[2],
        low: +k[3],
        close: +k[4]
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
    let sum = 0
    for (let i = 1; i < candles.length; i++) {
        sum += tr(candles[i], candles[i - 1])
    }
    return sum / (candles.length - 1)
}

export function analyzePrice(klines: any[], oiChangePct: number) {
    const candles = mapKlines(klines)
    const atr20 = atr(candles)
    const atr5 = atr(candles.slice(-5))

    const atrCompression = atr5 < atr20 * 0.7

    const first = candles[0].close
    const last = candles[candles.length - 1].close
    const priceChangePct = Math.abs((last - first) / first) * 100

    const priceEfficiency =
        priceChangePct / Math.max(Math.abs(oiChangePct), 1)

    return { atrCompression, priceEfficiency }
}
