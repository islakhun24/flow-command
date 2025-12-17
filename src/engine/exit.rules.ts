import {ExitContext} from "../types/exit";

export function shouldExitLong(ctx: ExitContext): boolean {
    // Bearish liquidity sweep
    if (
        ctx.sweepUp &&
        ctx.oiDelta > 0 &&
        ctx.lsRetail > 1.1 &&
        ctx.divergence > 0
    ) return true

    // BTC invalidates direction
    if (!ctx.btcValid) return true

    return false
}

export function shouldExitShort(ctx: ExitContext): boolean {
    // Bullish liquidity sweep
    if (
        ctx.sweepDown &&
        ctx.oiDelta > 0 &&
        ctx.lsRetail < 0.9 &&
        ctx.divergence < 0
    ) return true

    // BTC invalidates direction
    if (!ctx.btcValid) return true

    return false
}
