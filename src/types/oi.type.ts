export type OIRawItem = {
    timestamp: number | null
    openInterest: number | null
}

export type OIRawSource = {
    exchange: string;
    enabled: boolean
    data: OIRawItem[]
}

export type OIPerExchange = {
    oi: OIRawItem | null;
    exchange: string;
    enabled: boolean
}
