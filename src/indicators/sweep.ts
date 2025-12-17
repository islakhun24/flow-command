export interface SweepResult {
    sweepUp: boolean
    sweepDown: boolean
    wickSize: number
}

export function detectSweep(klines: any[]): SweepResult {
    if (klines.length < 2) {
        return { sweepUp: false, sweepDown: false, wickSize: 0 }
    }

    const last = klines[klines.length - 1]
    const prev = klines[klines.length - 2]

    const open = +last[1]
    const high = +last[2]
    const low = +last[3]
    const close = +last[4]

    const bodyLow = Math.min(open, close)
    const bodyHigh = Math.max(open, close)

    const wickDown = bodyLow - low
    const wickUp = high - bodyHigh

    const sweepDown = wickDown > close * 0.002 && low < +prev[3]
    const sweepUp = wickUp > close * 0.002 && high > +prev[2]

    return {
        sweepUp,
        sweepDown,
        wickSize: Math.max(wickUp, wickDown)
    }
}
