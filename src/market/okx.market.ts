import axios from "axios"
import {API_CONSTANTS} from "../config/api.constant";

const okx = API_CONSTANTS.OKX

const httpOkx = axios.create({
    baseURL: okx.baseUrlFuture,
    timeout: 10_000
})

type ApiRequestParam = Record<string, any>

async function getOkxData<T>(url: string | undefined, params?: ApiRequestParam): Promise<T> {
    if (!url) throw new Error("OKX endpoint undefined")
    const res = await httpOkx.get<{ data: T }>(url, { params })
    return res.data.data
}

export async function getOkxFutureSymbols() {
    return getOkxData<any[]>(
        okx.endpoints.symbols,
        {
            instType: "SWAP" // perpetual futures
        }
    )
}


export async function getOkxFutureTicker(params: { symbol: string }) {
    return getOkxData<any[]>(
        okx.endpoints.ticker,
        {
            instId: params.symbol // contoh: BTC-USDT-SWAP
        }
    )
}

export async function getOkxFutureMarkPrice(params: { symbol: string }) {
    return getOkxData<any[]>(
        okx.endpoints.markPrice,
        {
            instId: params.symbol
        }
    )
}

export async function getOkxFutureOpenInterest(params: { symbol: string }) {
    return getOkxData<any[]>(
        okx.endpoints.openInterest,
        {
            instId: params.symbol
        }
    )
}

export async function getOkxFutureOrderbook(params: { symbol: string; depth?: number }) {
    return getOkxData<any>(
        okx.endpoints.orderbook,
        {
            instId: params.symbol,
            sz: params.depth ?? 50
        }
    )
}

export async function getOkxFutureKlines(params: {
    symbol: string
    interval?: string
    limit?: number
}) {
    return getOkxData<any[]>(
        okx.endpoints.klines,
        {
            instId: params.symbol,
            bar: params.interval ?? "1m",
            limit: params.limit ?? 100
        }
    )
}

export async function getOkxFutureFundingRate(symbol: string) {
    return getOkxData<any[]>(
        okx.endpoints.fundingRate+"?instId="+symbol
    )
}
