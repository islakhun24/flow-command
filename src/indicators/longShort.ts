export interface LSBehavior {
    retailBias: "LONG" | "SHORT" | "NEUTRAL"
    topBias: "LONG" | "SHORT" | "NEUTRAL"
    retailRatio: number
    topRatio: number
}

export function analyzeLongShort(
    retail: number,
    top: number
): LSBehavior {
    const bias = (v: number) =>
        v > 1.1 ? "LONG" : v < 0.9 ? "SHORT" : "NEUTRAL"

    return {
        retailBias: bias(retail),
        topBias: bias(top),
        retailRatio: retail,
        topRatio: top
    }
}
