export interface SqueezeResult {
    score: number // 0–100
}

export function calcSqueeze(
    lsRetail: number,
    lsTop: number,
    oiDelta: number
): SqueezeResult {
    let score = 0

    score += (1 / lsRetail) * 25
    score += (1 / lsTop) * 25

    if (oiDelta > 0) score += Math.min(oiDelta * 5, 30)

    return {
        score: Math.max(0, Math.min(100, score))
    }
}
