import {Candle} from "../../types/candle.type";

export function calcATR(candles: Candle[], period = 14): number {
    let trs: number[] = []

    for (let i = 1; i < candles.length; i++) {
        const h = candles[i].high
        const l = candles[i].low
        const pc = candles[i - 1].close

        trs.push(Math.max(
            h - l,
            Math.abs(h - pc),
            Math.abs(l - pc)
        ))
    }

    const slice = trs.slice(-period)
    return slice.reduce((a, b) => a + b, 0) / slice.length
}
