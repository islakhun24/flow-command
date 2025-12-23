import axios from "axios"
import {API_CONSTANTS} from "../config/api.constant";

const bitmex = API_CONSTANTS.BITMEX

const httpBitmex = axios.create({
    baseURL: bitmex.baseUrlFuture,
    timeout: 10_000
})

async function getBitmexData<T>(
    url: string | undefined,
    params?: Record<string, any>
): Promise<T> {
    if (!url) throw new Error("BITMEX endpoint undefined")
    const res = await httpBitmex.get<T>(url, { params })
    return res.data
}

export async function getBitmexFutureTicker(params?: {
    symbol?: string
}) {
    return getBitmexData<any[]>(bitmex.endpoints.ticker, {
        symbol: params?.symbol
    })
}


export async function getBitmexFutureOrderbook(params: {
    symbol: string
    depth?: number
}) {
    return getBitmexData<any[]>(bitmex.endpoints.orderbook, {
        symbol: params.symbol,
        depth: params.depth ?? 50
    })
}

export async function getBitmexFutureKlines(params: {
    symbol: string
    binSize?: "1m" | "5m" | "15m" | "1h" | "4h" | "1d"
    count?: number
    reverse?: boolean
}) {
    return getBitmexData<any[]>(bitmex.endpoints.klines, {
        symbol: params.symbol,
        binSize: params.binSize ?? "1m",
        count: params.count ?? 100,
        reverse: params.reverse ?? true
    })
}

export async function getBitmexFundingRate(params?: {
    symbol?: string
    count?: number
}) {
    return getBitmexData<any[]>(bitmex.endpoints.fundingRate, {
        symbol: params?.symbol,
        count: params?.count ?? 1,
        reverse: true
    })
}
export async function getBitmexFundingRate(params?: {
    symbol?: string
    count?: number
}) {
    return getBitmexData<any[]>(bitmex.endpoints.fundingRate, {
        symbol: params?.symbol,
        count: params?.count ?? 1,
        reverse: true
    })
}

export async function getBitmexFutureSymbols() {
    return getBitmexData<any[]>(bitmex.endpoints.symbols)
}

export async function getBitmexOpenInterest(params?: {
    symbol?: string
}) {
    return getBitmexData<any[]>(bitmex.endpoints.symbols, {
        symbol: params?.symbol
    })
}
