import {calcFVGScore} from "./fvg.score";
import {MAX_FILL, MCAP_FACTOR, TF_FACTOR} from "../../config/fvg.config";
import {Candle} from "../../types/candle.type";

export type FVGDirection = "BULLISH" | "BEARISH";

export interface FVG {
    high: number;
    low: number;
    direction: FVGDirection;
    index: number;
}

export function detectFVG(
    candles: Candle[],
    atr: number,
    tf: keyof typeof TF_FACTOR,
    mcapClass: keyof typeof MCAP_FACTOR,
    currentPrice: number
): FVG[] {

    const fvgs: FVG[] = []

    for (let i = 1; i < candles.length - 1; i++) {
        // bullish FVG
        if (candles[i - 1].high < candles[i + 1].low) {
            const high = candles[i + 1].low
            const low = candles[i - 1].high
            const size = high - low

            const minSize = atr * TF_FACTOR[tf] * MCAP_FACTOR[mcapClass]
            const fill = ((currentPrice - low) / size) * 100

            const valid = size >= minSize && fill <= MAX_FILL[mcapClass]

            fvgs.push({
                high,
                low,
                size,
                fillPercent: fill,
                valid,
                score: calcFVGScore(size, minSize, fill, mcapClass)
            })
        }
    }

    return fvgs
}
