import { RISK_CONFIG } from "../config/risk"
import {SignalResult} from "../types/signal.types";

let openPositions: { symbol: string }[] = []

export function canOpenPosition() {
    return openPositions.length < RISK_CONFIG.MAX_POSITIONS
}

export function registerPosition(symbol: string) {
    openPositions.push({ symbol })
}

export function unregisterPosition(symbol: string) {
    openPositions = openPositions.filter(p => p.symbol !== symbol)
}

export function getOpenPositions() {
    return openPositions
}

export function selectBestSignal(signals: SignalResult[]) {
    return signals.sort((a, b) => b.confidence - a.confidence)[0]
}
