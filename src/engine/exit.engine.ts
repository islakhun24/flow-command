import { shouldExitLong, shouldExitShort } from "./exit.rules"
import { updateProfitLock } from "./profitLock"
import { onPositionClosed } from "./autoTrade.engine"
import {getMarketContext, getMarketSnapshot} from "../market/market.service"
import {Position} from "../types/position";

export async function evaluateExit(position: Position) {
    const ctx = await getMarketContext(position.symbol)
    const price = ctx.price

    // 1️⃣ Profit Lock has priority
    const lock = updateProfitLock(position, price)
    if (lock.exit) {
        await onPositionClosed(position.symbol, lock.lockedPnL, lock.reason)
        return
    }

    // 2️⃣ Dynamic liquidity exit
    if (position.side === "LONG") {
        if (shouldExitLong(ctx)) {
            const pnl = (price - position.entry) / position.entry
            await onPositionClosed(position.symbol, pnl, "LIQUIDITY_REVERSAL")
        }
    }

    if (position.side === "SHORT") {
        if (shouldExitShort(ctx)) {
            const pnl = (position.entry - price) / position.entry
            await onPositionClosed(position.symbol, pnl, "LIQUIDITY_REVERSAL")
        }
    }
}
