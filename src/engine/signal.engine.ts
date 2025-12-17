import { detectSweep } from "../indicators/sweep"
import { analyzeLongShort } from "../indicators/longShort"
import { calcOIDelta } from "../indicators/openInterest"
import { calcSqueeze } from "../indicators/squeeze"
import { calcBTCActivity } from "../indicators/btcActivity"
import { calcConfidence } from "../indicators/confidence"
import {SignalResult, TradeBias} from "../types/signal.types";
import {MarketSnapshot} from "../types/market";

interface BuildSignalParams {
    symbol: string
    timeframe: string
    klines: any[]
    lsRetail: number
    lsTop: number
    oiCurrent: number
    oiPrev: number
    marketCapCategory: "BIG" | "MID" | "SMALL"
    isBTC: boolean
}

export function buildSignal(params: BuildSignalParams): SignalResult {
    const reasons: string[] = []

    // 1️⃣ Sweep
    const sweep = detectSweep(params.klines)
    if (sweep.sweepUp) reasons.push("Liquidity sweep atas")
    if (sweep.sweepDown) reasons.push("Liquidity sweep bawah")

    // 2️⃣ Long Short
    const ls = analyzeLongShort(params.lsRetail, params.lsTop)
    reasons.push(`Retail ${ls.retailBias}, Top ${ls.topBias}`)

    // 3️⃣ OI
    const oi = calcOIDelta(params.oiCurrent, params.oiPrev)
    reasons.push(`OI ${oi.direction}`)

    // 4️⃣ Squeeze
    const squeeze = calcSqueeze(params.lsRetail, params.lsTop, oi.delta)

    // 5️⃣ BTC Activity
    const btcActivity = calcBTCActivity(
        oi.delta,
        params.lsRetail,
        sweep
    )

    if (btcActivity.active) {
        reasons.push("BTC liquidity active")
    } else {
        reasons.push("BTC liquidity pasif")
    }

    // 6️⃣ Bias Decision (STRICT)
    let bias: TradeBias = "NEUTRAL"

    if (sweep.sweepDown && oi.direction === "IN" && ls.retailBias === "SHORT") {
        bias = "LONG"
    }

    if (sweep.sweepUp && oi.direction === "IN" && ls.retailBias === "LONG") {
        bias = "SHORT"
    }

    // 7️⃣ Confidence
    const confidence = calcConfidence(
        sweep,
        ls,
        oi,
        squeeze.score,
        params.marketCapCategory
    )

    // 8️⃣ BTC VALID RULE
    let btcValid = true

    if (!params.isBTC) {
        btcValid = btcActivity.active
        if (!btcValid) {
            bias = "NEUTRAL"
            reasons.push("ALT dibatalkan: BTC tidak aktif")
        }
    }

    return {
        symbol: params.symbol,
        timeframe: params.timeframe,
        bias,
        btcValid,
        confidence,
        reasons,
        snapshot: {
            sweepUp: sweep.sweepUp,
            sweepDown: sweep.sweepDown,
            lsRetail: params.lsRetail,
            lsTop: params.lsTop,
            oiDelta: oi.delta,
            squeeze: squeeze.score,
            btcActivityScore: btcActivity.score
        },
        createdAt: Date.now()
    }
}

export function generateSignalBacktet(
    ctx: MarketSnapshot
): any | null {
    if (!ctx.btcValid) return null

    if (ctx.sweepDown && ctx.oiDelta > 0 && ctx.lsRetail < 0.8) {
        return { side: "LONG", confidence: 78 }
    }

    if (ctx.sweepUp && ctx.oiDelta > 0 && ctx.lsRetail > 1.2) {
        return { side: "SHORT", confidence: 76 }
    }

    return null
}

function computeTPBacktest(price: number, side: "LONG" | "SHORT") {
    return side === "LONG"
        ? {
            tp1: price * 1.005,
            tp2: price * 1.01,
            sl:  price * 0.99
        }
        : {
            tp1: price * 0.995,
            tp2: price * 0.99,
            sl:  price * 1.01
        }
}
