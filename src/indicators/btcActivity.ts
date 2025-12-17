export interface BTCActivity {
    active: boolean
    score: number // 0–100
    reason: string[]
}

export function calcBTCActivity(
    oiDelta: number,
    lsRetail: number,
    sweep: { sweepUp: boolean; sweepDown: boolean }
): BTCActivity {
    let score = 0
    const reason: string[] = []

    if (Math.abs(oiDelta) > 0) {
        score += Math.min(Math.abs(oiDelta) * 5, 40)
        reason.push("OI berubah signifikan")
    }

    if (lsRetail > 1.2 || lsRetail < 0.8) {
        score += 30
        reason.push("Retail ekstrem")
    }

    if (sweep.sweepUp || sweep.sweepDown) {
        score += 30
        reason.push("Liquidity sweep BTC")
    }

    return {
        active: score >= 60,
        score,
        reason
    }
}
