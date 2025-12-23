import axios from "axios"
import {API_CONSTANTS} from "../config/api.constant";
import {ApiRequestParam} from "../types/futuresApi.type";

const deribit = API_CONSTANTS.DERIBIT

const http = axios.create({
    baseURL: deribit.baseUrlFuture,
    timeout: 10_000
})

async function getDeribitData<T>(url: string | undefined, params?: any): Promise<T> {
    const res = await http.get<T>(url, { params })
    return res.data
}

/** Ticker */
export async function getDeribitFutureTicker(params?: ApiRequestParam) {
    return getDeribitData<any>(deribit.endpoints.ticker, {
        instrument_name: params?.symbol
    })
}

/** Orderbook */
export async function getDeribitFutureOrderbook(params?: ApiRequestParam) {
    return getDeribitData<any>(deribit.endpoints.orderbook, {
        instrument_name: params?.symbol,
        depth: params?.limit ?? 20
    })
}

/** Funding Rate */
export async function getDeribitFundingRate(params?: ApiRequestParam) {
    return getDeribitData<any>(deribit.endpoints.fundingRate, {
        instrument_name: params?.symbol
    })
}

/** Instruments / Symbols */
export async function getDeribitFutureSymbols() {
    return getDeribitData<any>(deribit.endpoints.symbols, {
        currency: "BTC",
        kind: "future"
    })
}
