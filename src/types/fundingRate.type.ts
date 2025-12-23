export type Exchange = "binance" | "okx" | "bybit" | "bitmex" | "deribit" | "gate" | "huobi" | "kucoin" | "phemex" | "delta" | "hyperliquid"
export interface FundingRateExchangeType {
    exchange: Exchange,
    value: number,
    intervalHours: number,
    timeStamp: number
    annualized: number
    sign: -1 | 0 | 1
    valid: boolean
}
