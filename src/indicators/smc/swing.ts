export type SwingType = "HIGH" | "LOW";

export interface SwingPoint {
    index: number;
    price: number;
    type: SwingType;
}

/**
 * lookback = 2 atau 3 disarankan
 */
export function detectSwings(
    candles: any[],
    lookback = 2
): SwingPoint[] {
    const swings: SwingPoint[] = [];

    for (let i = lookback; i < candles.length - lookback; i++) {
        const high = candles[i].high;
        const low = candles[i].low;

        let isHigh = true;
        let isLow = true;

        for (let j = 1; j <= lookback; j++) {
            if (candles[i - j].high >= high || candles[i + j].high >= high) {
                isHigh = false;
            }
            if (candles[i - j].low <= low || candles[i + j].low <= low) {
                isLow = false;
            }
        }

        if (isHigh) {
            swings.push({ index: i, price: high, type: "HIGH" });
        }

        if (isLow) {
            swings.push({ index: i, price: low, type: "LOW" });
        }
    }

    return swings;
}
export type SwingType = "HIGH" | "LOW";

export interface SwingPoint {
    index: number;
    price: number;
    type: SwingType;
}

/**
 * lookback = 2 atau 3 disarankan
 */
export function detectSwings(
    candles: any[],
    lookback = 2
): SwingPoint[] {
    const swings: SwingPoint[] = [];

    for (let i = lookback; i < candles.length - lookback; i++) {
        const high = candles[i].high;
        const low = candles[i].low;

        let isHigh = true;
        let isLow = true;

        for (let j = 1; j <= lookback; j++) {
            if (candles[i - j].high >= high || candles[i + j].high >= high) {
                isHigh = false;
            }
            if (candles[i - j].low <= low || candles[i + j].low <= low) {
                isLow = false;
            }
        }

        if (isHigh) {
            swings.push({ index: i, price: high, type: "HIGH" });
        }

        if (isLow) {
            swings.push({ index: i, price: low, type: "LOW" });
        }
    }

    return swings;
}
