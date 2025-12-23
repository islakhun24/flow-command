function calcGapPercent(
    low: number,
    high: number,
    referencePrice: number
): number {
    return ((high - low) / referencePrice) * 100
}


function isTouchedAfter(
    candles: Kli[],
    low: number,
    high: number,
    fromIndex: number
): boolean {
    for (let i = fromIndex + 1; i < candles.length; i++) {
        const c = candles[i]

        // wick masuk area = dianggap keisi
        if (c.high >= low && c.low <= high) {
            return true
        }
    }
    return false
}
