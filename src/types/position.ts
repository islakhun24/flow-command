import {TradeBias} from "./signal.types";

export interface Position {
    symbol: string
    side: TradeBias
    entry: number
    qty: number

    entryOI: number
    peakPnL?: number

    category: "bigcap" | "midcap" | "smallcap"

    openedAt: number
}
