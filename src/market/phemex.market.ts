import axios from "axios"
import {API_CONSTANTS} from "../config/api.constant";
import {ApiRequestParam} from "../types/futuresApi.type";

const phemex = API_CONSTANTS.PHEMEX

const http = axios.create({
    baseURL: phemex.baseUrlFuture,
    timeout: 10_000
})

async function getPhemexData<T>(url: string | undefined, params?: any): Promise<T> {
    const res = await http.get<T>(url, { params })
    return res.data
}

/** Ticker */
export async function getPhemexFutureTicker(params?: ApiRequestParam) {
    return getPhemexData<any>(phemex.endpoints.ticker, {
        symbol: params?.symbol
    })
}

/** Orderbook */
export async function getPhemexFutureOrderbook(params?: ApiRequestParam) {
    return getPhemexData<any>(phemex.endpoints.orderbook, {
        symbol: params?.symbol,
        limit: params?.limit ?? 20
    })
}

/** Klines */
export async function getPhemexFutureKlines(params?: ApiRequestParam) {
    return getPhemexData<any>(phemex.endpoints.klines, {
        symbol: params?.symbol,
        resolution: params?.interval ?? "1"
    })
}

/** Funding Rate */
export async function getPhemexFundingRate(params?: ApiRequestParam) {
    return getPhemexData<any>(phemex.endpoints.fundingRate, {
        symbol: params?.symbol
    })
}
