import {Position} from "../types/position";

const PROFIT_TRIGGER = 0.20   // 20%
const LOCK_BACK = 0.05        // retrace 5%

export function updateProfitLock(position: Position, price: number) {
    const pnl =
        position.side === "LONG"
            ? (price - position.entry) / position.entry
            : (position.entry - price) / position.entry

    if (!position.peakPnL || pnl > position.peakPnL) {
        position.peakPnL = pnl
    }

    if (position.peakPnL >= PROFIT_TRIGGER) {
        const lockLevel = position.peakPnL - LOCK_BACK
        if (pnl <= lockLevel) {
            return {
                exit: true,
                reason: "PROFIT_LOCK",
                lockedPnL: lockLevel
            }
        }
    }

    return { exit: false }
}
