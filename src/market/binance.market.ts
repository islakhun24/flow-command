import axios from "axios";
import {API_CONSTANTS} from "../config/api.constant";
import {ApiRequestParam, EndpointKey} from "../types/futuresApi.type";

const binance = API_CONSTANTS.BINANCE

const httpFutures = axios.create({
    baseURL: binance.baseUrlFuture,
    timeout: 10_000
})

async function getFuturesData<T>(url: string | undefined, params?: ApiRequestParam): Promise<T> {
    const res = await httpFutures.get<T>(url, { params })
    return res.data
}

export async function getBinanceFutureTicker(params?: ApiRequestParam) {
    return getFuturesData<any>(binance.endpoints.ticker, {
        symbol: params?.symbol
    })
}

export async function getBinanceFutureSymbols() {
    return getFuturesData<any[]>(binance.endpoints.symbols)
}

export async function getBinanceFutureKline(params?: ApiRequestParam) {
    return getFuturesData<any[]>(binance.endpoints.klines, {
        symbol: params?.symbol,
        interval: params?.period,
        limit: params?.limit,
        startTime: params?.startTime,
        endTime: params?.endTime
    })
}

export async function getBinanceFutureOrderbook(params?: ApiRequestParam) {
    return getFuturesData<any>(binance.endpoints.orderbook, {
        symbol: params?.symbol,
        limit: params?.limit
    })
}

export async function getBinanceFutureOpenInterest(params?: ApiRequestParam) {
    return getFuturesData<any>(binance.endpoints.openInterest, {
        symbol: params?.symbol
    })
}

export async function getBinanceFutureOpenInterestHist(params?: ApiRequestParam) {
    return getFuturesData<any[]>(binance.endpoints.openInterestHist, {
        symbol: params?.symbol,
        period: params?.period,
        limit: params?.limit
    })
}

export async function getBinanceFutureFundingRate(params?: ApiRequestParam) {
    return getFuturesData<any>(binance.endpoints.fundingRate, {
        symbol: params?.symbol
    })
}

export async function getBinanceFutureFundingRateHist(params?: ApiRequestParam) {
    return getFuturesData<any[]>(binance.endpoints.fundingRateHist, {
        symbol: params?.symbol,
        limit: params?.limit,
        startTime: params?.startTime,
        endTime: params?.endTime
    })
}

export async function getBinanceFutureMarkPrice(params?: ApiRequestParam) {
    return getFuturesData<any>(binance.endpoints.markPrice, {
        symbol: params?.symbol
    })
}

export async function getBinanceFutureLiquidations(params?: ApiRequestParam) {
    return getFuturesData<any[]>(binance.endpoints.liquidations, {
        symbol: params?.symbol,
        limit: params?.limit,
        startTime: params?.startTime,
        endTime: params?.endTime
    })
}

export async function getBinanceFutureLongShortGlobal(params?: ApiRequestParam) {
    return getFuturesData<any[]>(binance.endpoints.longShortGlobal, {
        symbol: params?.symbol,
        period: params?.period,
        limit: params?.limit
    })
}

export async function getBinanceFutureLongShortTopAccount(params?: ApiRequestParam) {
    return getFuturesData<any[]>(binance.endpoints.longShortTopAccount, {
        symbol: params?.symbol,
        period: params?.period,
        limit: params?.limit
    })
}

export async function getBinanceFutureLongShortTopPosition(params?: ApiRequestParam) {
    return getFuturesData<any[]>(binance.endpoints.longShortTopPosition, {
        symbol: params?.symbol,
        period: params?.period,
        limit: params?.limit
    })
}

export function generateBinanceFutureFetcher<K extends EndpointKey>(key: K) {
    return (params?: ApiRequestParam) => {
        return getFuturesData<any>(
            binance.endpoints[key],
            params
        )
    }
}



