export type TradingStyle =
    | "SCALPING"
    | "INTRADAY"
    | "SWING"
    | "POSITION"

export interface TradingConfig {
    funding: {
        timeframe: string
        window: number
        role: "FILTER" | "BIAS"
    }
    lsRatio: {
        timeframe: string
        window: number
        role: "FILTER" | "BIAS"
        extreme: {
            long: number
            short: number
            persistence: number
        }
    }
    openInterest: {
        timeframe: string
        window: number
        role: "CONFIRMATION"
    }
    volume: {
        timeframe: string
        window: number
        useCVD: boolean
    }
    price: {
        timeframe: string
        window: number
        structure: boolean
        liquidity: boolean
    }
    volatility: {
        timeframe: string
        atrWindow: number
    }
    risk: {
        maxRiskPerTrade: number
        minRR: number
    }
}
