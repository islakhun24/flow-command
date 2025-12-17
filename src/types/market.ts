export interface MarketSnapshot {
    symbol: string
    price: number

    // Liquidity
    sweepUp: boolean
    sweepDown: boolean

    // Derivatives
    oi: number
    oiDelta: number
    lsRetail: number
    lsTop: number

    // Correlation
    divergence: number
    trend: "UP" | "DOWN" | "SIDEWAYS"

    // BTC Sync
    btcValid: boolean
}
