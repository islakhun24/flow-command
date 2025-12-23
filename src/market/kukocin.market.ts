import {API_CONSTANTS} from "../config/api.constant";
import axios from "axios";
import {ApiRequestParam} from "../types/futuresApi.type";

const kucoin = API_CONSTANTS.KUCOIN

const httpKucoin = axios.create({
    baseURL: kucoin.baseUrlFuture,
    timeout: 10_000
})

async function getKucoinFuturesData<T>(
    url: string | undefined,
    params?: ApiRequestParam
): Promise<T> {
    if (!url) throw new Error("KUCOIN endpoint undefined")
    const res = await httpKucoin.get<T>(url, { params })
    return res.data
}

export async function getKucoinFutureTicker(params?: ApiRequestParam) {
    return getKucoinFuturesData<any>(kucoin.endpoints.ticker, {
        symbol: params?.symbol
    })
}

export async function getKucoinFutureOpenInterest(params?: ApiRequestParam) {
    return getKucoinFuturesData<any>(kucoin.endpoints.openInterest, {
        symbol: params?.symbol
    })
}

export async function getKucoinFutureOrderbook(params?: ApiRequestParam) {
    return getKucoinFuturesData<any>(kucoin.endpoints.orderbook, {
        symbol: params?.symbol
    })
}

export async function getKucoinFutureKlines(params?: ApiRequestParam) {
    return getKucoinFuturesData<any>(kucoin.endpoints.klines, {
        symbol: params?.symbol,
        granularity: params?.interval ?? "1min",
        limit: params?.limit ?? 200
    })
}
export async function getKucoinFutureKlines(params?: ApiRequestParam) {
    return getKucoinFuturesData<any>(kucoin.endpoints.klines, {
        symbol: params?.symbol,
        granularity: params?.interval ?? "1min",
        limit: params?.limit ?? 200
    })
}

export async function getKucoinFutureSymbols() {
    return getKucoinFuturesData<any>(kucoin.endpoints.symbols)
}

export async function getKucoinFutureFundingRate(params?: ApiRequestParam) {
    const now = Date.now()

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)

    const {data} = await getKucoinFuturesData<any>(kucoin.endpoints.fundingRate, {
        symbol: params?.symbol == 'BTCUSDT' ? "XBTUSDTM" : (params?.symbol + "M"),
        from: yesterday.getTime(),
        to: now
    })
    return data
}

