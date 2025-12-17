import { getMarketContext } from "../market/market.service"
import { MarketSnapshot } from "../types/market"
import { SignalResult } from "../types/signal.types"

interface BacktestResult {
    totalTrades: number
    wins: number
    losses: number
    tp1: number
    tp2: number
    tp3: number
    wr: number
}

export async function runBacktest(
    symbol: string,
    candles: MarketSnapshot[]
): Promise<BacktestResult> {

    let position: SignalResult | null = null

    let wins = 0
    let losses = 0
    let tp1 = 0
    let tp2 = 0
    let tp3 = 0

    for (let i = 10; i < (candles||[]).length; i++) {
        const ctx = candles[i]

        // ======================
        // ENTRY LOGIC
        // ======================
        if (!position) {
            const canEnter =
                ctx.btcValid &&
                ctx.oiDelta > 0 &&
                (
                    (ctx.sweepDown && ctx.lsRetail < 0.9) ||
                    (ctx.sweepUp && ctx.lsRetail > 1.1)
                )

            if (!canEnter) continue

            const side =
                ctx.sweepDown ? "LONG" :
                    ctx.sweepUp ? "SHORT" : null

            if (!side) continue

            const entry = ctx.price
            const sl =
                side === "LONG"
                    ? entry * 0.98
                    : entry * 1.02

            const tp = {
                tp1: side === "LONG" ? entry * 1.01 : entry * 0.99,
                tp2: side === "LONG" ? entry * 1.03 : entry * 0.97,
                tp3: side === "LONG" ? entry * 1.06 : entry * 0.94,
            }

            position = {
                symbol,
                side,
                confidence: 80,
                entry,
                entryZone: { low: entry * 0.995, high: entry * 1.005 },
                stopLoss: sl,
                tp,
                btcValid: true,
                reasons: [],
                createdAt: Date.now()
            } as SignalResult

            continue
        }

        // ======================
        // EXIT LOGIC
        // ======================
        if (position) {
            const price = ctx.price
            const side = position.bias

            const hitSL =
                side === "LONG"
                    ? price <= position.stopLoss
                    : price >= position.stopLoss

            const hitTP1 =
                side === "LONG"
                    ? price >= position.tp.tp1
                    : price <= position.tp.tp1

            const hitTP2 =
                side === "LONG"
                    ? price >= position.tp.tp2
                    : price <= position.tp.tp2

            const hitTP3 =
                side === "LONG"
                    ? price >= position.tp.tp3
                    : price <= position.tp.tp3

            // ---- PROFIT LOCK BEHAVIOR ----
            if (hitTP3) {
                tp3++
                wins++
                position = null
                continue
            }

            if (hitTP2) {
                tp2++
                wins++
                position = null
                continue
            }

            if (hitTP1) {
                tp1++
                wins++
                position = null
                continue
            }

            // ---- VALID SWEEP EXIT ----
            const oppositeSweep =
                (side === "LONG" && ctx.sweepUp && ctx.oiDelta > 0) ||
                (side === "SHORT" && ctx.sweepDown && ctx.oiDelta > 0)

            if (oppositeSweep) {
                losses++
                position = null
                continue
            }

            if (hitSL) {
                losses++
                position = null
                continue
            }
        }
    }

    const totalTrades = wins + losses

    return {
        totalTrades,
        wins,
        losses,
        tp1,
        tp2,
        tp3,
        wr: totalTrades === 0 ? 0 : (wins / totalTrades) * 100
    }
}
