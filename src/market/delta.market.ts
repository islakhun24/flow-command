import axios from "axios"
import {API_CONSTANTS} from "../config/api.constant";
import {ApiRequestParam} from "../types/futuresApi.type";

const delta = API_CONSTANTS.DELTA

const http = axios.create({
    baseURL: delta.baseUrlFuture,
    timeout: 10_000
})

async function getDeltaData<T>(url: string | undefined, params?: any): Promise<T> {
    const res = await http.get<T>(url, { params })
    return res.data
}

/** Symbols */
export async function getDeltaFutureSymbols() {
    return getDeltaData<any>(delta.endpoints.symbols)
}

/** Ticker */
export async function getDeltaFutureTicker(params?: ApiRequestParam) {
    return getDeltaData<any>(delta.endpoints.ticker, {
        symbol: params?.symbol
    })
}

/** Orderbook */
export async function getDeltaFutureOrderbook(params?: ApiRequestParam) {
    return getDeltaData<any>(delta.endpoints.orderbook, {
        symbol: params?.symbol,
        depth: params?.limit ?? 20
    })
}

/** Funding Rate */
export async function getDeltaFundingRate(params?: ApiRequestParam) {
    return getDeltaData<any>(delta.endpoints.fundingRate, {
        symbol: params?.symbol
    })
}
