export type HyperliquidChannel =
    | "trades"
    | "l2Book"
    | "funding"
    | "openInterest"

export interface HyperliquidWSOptions {
    symbol: string
    channels: HyperliquidChannel[]
    onMessage: (data: any) => void
}


export interface HyperliquidWSMessage<T = any> {
    channel: string
    data: T
}

