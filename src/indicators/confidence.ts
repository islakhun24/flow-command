import { SweepResult } from "./sweep"
import { LSBehavior } from "./longShort"
import { OIResult } from "./openInterest"

export function calcConfidence(
    sweep: SweepResult,
    ls: LSBehavior,
    oi: OIResult,
    squeezeScore: number,
    marketCapCategory: "BIG" | "MID" | "SMALL"
): number {
    let c = 0

    if (sweep.sweepUp || sweep.sweepDown) c += 20
    if (oi.direction === "IN") c += 15
    if (ls.retailBias !== ls.topBias) c += 15

    c += squeezeScore * 0.4

    if (marketCapCategory === "SMALL") c += 10
    if (marketCapCategory === "BIG") c -= 10

    return Math.max(0, Math.min(100, c))
}
