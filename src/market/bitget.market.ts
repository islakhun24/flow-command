import axios from "axios"
import {API_CONSTANTS} from "../config/api.constant";
import {ApiRequestParam} from "../types/futuresApi.type";

const bitget = API_CONSTANTS.BITGET

const httpBitgetFutures = axios.create({
    baseURL: bitget.baseUrlFuture,
    timeout: 10_000
})

async function getBitgetFuturesData<T>(
    url: string | undefined,
    params?: ApiRequestParam
): Promise<T> {
    if (!url) throw new Error("BITGET endpoint undefined")
    const res = await httpBitgetFutures.get<T>(url, { params })
    return res.data
}

export async function getBitgetFutureTicker(params?: {
    symbol?: string
    productType?: "USDT-FUTURES" | "COIN-FUTURES"
}) {
    return getBitgetFuturesData<any>(bitget.endpoints.ticker, {
        symbol: params?.symbol,
        productType: params?.productType ?? "USDT-FUTURES"
    })
}


export async function getBitgetFutureOpenInterest(params: {
    symbol: string
    productType?: "USDT-FUTURES" | "COIN-FUTURES"
}) {
    return getBitgetFuturesData<any>(bitget.endpoints.openInterest, {
        symbol: params.symbol,
        productType: params.productType ?? "USDT-FUTURES"
    })
}

export async function getBitgetFutureOrderbook(params: {
    symbol: string
    limit?: number
}) {
    return getBitgetFuturesData<any>(bitget.endpoints.orderbook, {
        symbol: params.symbol,
        limit: params.limit ?? 50
    })
}

export async function getBitgetFutureKlines(params: {
    symbol: string
    granularity?: string // 1m, 5m, 15m, 1h, 4h, 1d
    limit?: number
}) {
    return getBitgetFuturesData<any>(bitget.endpoints.klines, {
        symbol: params.symbol,
        granularity: params.granularity ?? "1m",
        limit: params.limit ?? 200
    })
}

