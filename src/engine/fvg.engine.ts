import {Candle} from "../types/candle.type";
import {FVGConfig} from "../config/constant";
import {FVG} from "../types/fvg.type";

export function findLastUnfilledFVGWithGap(
    candles: Candle[],
    config: FVGConfig
): FVG | null {
    if (candles.length < 3) return null

    for (let i = candles.length - 1; i >= 2; i--) {
        const c0 = candles[i]
        const c2 = candles[i - 2]

        /* ===============================
           BULLISH FVG
        ================================ */
        if (c2.high < c0.low) {
            const low = c2.high
            const high = c0.low

            const gapPercent = calcGapPercent(low, high, low)

            if (
                gapPercent >= config.minGapPercent &&
                !isTouchedAfter(candles, low, high, i)
            ) {
                return {
                    type: "BULLISH",
                    low,
                    high,
                    startIndex: i - 2,
                    endIndex: i
                }
            }
        }

        /* ===============================
           BEARISH FVG
        ================================ */
        if (c2.low > c0.high) {
            const low = c0.high
            const high = c2.low

            const gapPercent = calcGapPercent(low, high, high)

            if (
                gapPercent >= config.minGapPercent &&
                !isTouchedAfter(candles, low, high, i)
            ) {
                return ({
                        type: "BEARISH",
                        low,
                        high,
                        startIndex: i - 2,
                        endIndex: i
                    }
                )
            }
        }

        return null
    }
}
