// src/common/ls/ls.type.ts

export type LSType = "GLOBAL" | "TOP_ACCOUNT" | "TOP_POSITION"

export type LSRawItem = {
    timestamp: number | null
    longAccount: number | null
    shortAccount: number | null
    longShortRatio: number | null
    longPosition: number | null
    shortPosition: number | null
}

export type LSRawSource = {
    enabled: boolean
    type: LSType
    data: LSRawItem[]   // SELALU ARRAY
}

export type LSPerExchange = {
    exchange: string
    global?: LSRawSource
    topAccount?: LSRawSource | null
    topPosition?: LSRawSource | null
}

export type LSRawResponse = {
    symbol: string
    timeframe: string
    exchanges: LSPerExchange[]
}
