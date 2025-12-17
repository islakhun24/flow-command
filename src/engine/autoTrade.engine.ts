import { computePositionSize } from "./sizing"
import {
    canOpenPosition,
    registerPosition,
    unregisterPosition,
    selectBestSignal
} from "./position.manager"
import { openPosition, closePosition } from "../db/services/position.service"
import { RISK_CONFIG } from "../config/risk"
import { sendExitAlert } from "../alert/exit.alert"
import {SignalResult} from "../types/signal.types";

const AUTO_TRADE_ENABLED = true

// Mock balance (nanti sambung API exchange)
const ACCOUNT_BALANCE = 1000

export async function tryAutoTrade(signal: SignalResult) {
    if (!AUTO_TRADE_ENABLED) return
    if (!signal.btcValid) return
    if (signal.bias === "NEUTRAL") return
    if (signal.confidence < 80) return
    if (!canOpenPosition()) return

    const size = computePositionSize(
        ACCOUNT_BALANCE,
        RISK_CONFIG.RISK_PER_TRADE,
        signal.entryZone.low
    )

    await openPosition({
        symbol: signal.symbol,
        side: signal.bias,
        entry: signal.entryZone.low,
        size
    })

    registerPosition(signal.symbol)

    console.log(`🤖 AUTO OPEN → ${signal.symbol} | ${signal.bias} | size ${size}`)
}

export async function onPositionClosed(
    symbol: string,
    pnl: number,
    reason: string
) {
    await closePosition(symbol, pnl, reason)
    unregisterPosition(symbol)

    await sendExitAlert(symbol, reason)
}
