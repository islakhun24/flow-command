export type TradeBias = "LONG" | "SHORT" | "NEUTRAL"

export interface SignalSnapshot {
    sweepUp: boolean
    sweepDown: boolean
    lsRetail: number
    lsTop: number
    oiDelta: number
    squeeze: number
    btcActivityScore: number
}

export interface SignalResult {
    symbol: string
    timeframe: string
    bias: TradeBias
    btcValid: boolean
    confidence: number
    reasons: string[]
    snapshot: SignalSnapshot
    createdAt: number
}
export type TradeBias = "LONG" | "SHORT" | "NEUTRAL"

export interface SignalSnapshot {
    sweepUp: boolean
    sweepDown: boolean
    lsRetail: number
    lsTop: number
    oiDelta: number
    squeeze: number
    btcActivityScore: number
}

export interface SignalResult {
    symbol: string
    timeframe: string
    bias: TradeBias
    btcValid: boolean
    entryZone: {
        low: number
        high: number
    }

    stopLoss: number

    tp: {
        tp1: number
        tp2: number
        tp3: number
    }
    confidence: number
    reasons: string[]
    snapshot: SignalSnapshot
    createdAt: number
}

