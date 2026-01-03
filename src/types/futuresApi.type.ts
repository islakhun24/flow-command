// api.types.ts
export type EndpointKey =
    | "ticker"
    | "symbols"
    | "klines"
    | "orderbook"
    | "openInterest"
    | "openInterestHist"
    | "fundingRate"
    | "fundingRateHist"
    | "markPrice"
    | "liquidations"
    | "longShortGlobal"
    | "longShortTopAccount"
    | "longShortTopPosition"
    | "meta"
    | "trades"
    | "funding"
    | "liquidationData"


// api.types.ts
export interface ExchangeApiConfig {
    baseUrlFuture: string
    baseUrlSpot?: string
    wsUrl?: string
    endpoints: Partial<Record<EndpointKey, string>>
}

export interface ApiRequestParam {
    symbol?: string | undefined;
    period?: "5m" | "15m" | "30m" | "1h" | "2h" | "4h" | "6h" | "12h" | "1d" | "3d" | "1W" | "1M" | undefined | string;
    limit?: number | undefined;
    startTime?: number | undefined;
    endTime?: number | undefined
    interval?: string,
    from?: number,
    to?: number,
    contract?: string,
    settle?: 'usdt'
}
