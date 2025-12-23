export type BybitCategory = "linear" | "inverse"

export interface BybitTicker {
    symbol: string
    lastPrice: string
    markPrice: string
    fundingRate?: string
    openInterest?: string
    volume24h: string
}

export interface BybitKline {
    start: number
    open: number
    high: number
    low: number
    close: number
    volume: number
}

export function mapBuySellToLSBybit(apiData?: any[]) {
    if (!Array.isArray(apiData)) return []

    return apiData.map(d => ({
        timestamp: d.timestamp ? Number(d.timestamp) : null,

        longAccount: d.buyRatio != null
            ? Number(d.buyRatio)
            : null,

        shortAccount: d.sellRatio != null
            ? Number(d.sellRatio)
            : null,

        longShortRatio:
            d.buyRatio != null && d.sellRatio != null && Number(d.sellRatio) !== 0
                ? Number(d.buyRatio) / Number(d.sellRatio)
                : null,

        longPosition: null,
        shortPosition: null
    }))
}
