import {API_CONSTANTS} from "../config/api.constant";
import axios from "axios";
import {ApiRequestParam} from "../types/futuresApi.type";

const mexc = API_CONSTANTS.MEXC

const httpMEXC = axios.create({
    baseURL: mexc.baseUrlFuture,
    timeout: 10_000
})

async function getMEXCData<T>(url: string | undefined, params?: ApiRequestParam): Promise<T> {
    const res = await httpMEXC.get<T>(url, { params })
    return res.data
}

export async function getMEXCFutureTicker(params?: ApiRequestParam) {
    return getMEXCData<any>(mexc.endpoints.ticker, {
        symbol: params?.symbol
    })
}


export async function getMEXCOpenInterest(params?: ApiRequestParam) {
    return getMEXCData<any>(mexc.endpoints.openInterest, {
        symbol: params?.symbol
    })
}

export async function getMEXCOrderbook(params?: ApiRequestParam) {
    return getMEXCData<any>(mexc.endpoints.orderbook, {
        symbol: params?.symbol,
        limit: params?.limit ?? 50
    })
}

export async function getMEXCKlines(params?: ApiRequestParam) {
    return getMEXCData<any>(mexc.endpoints.klines, {
        symbol: params?.symbol,
        interval: params?.interval ?? "1m",
        limit: params?.limit ?? 100
    })
}
