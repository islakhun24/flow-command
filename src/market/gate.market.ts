import axios from "axios"
import {API_CONSTANTS} from "../config/api.constant";
import {ApiRequestParam} from "../types/futuresApi.type";
import {gateSymbol} from "../utils/gate.util";

const gate = API_CONSTANTS.GATE

const httpGateFutures = axios.create({
    baseURL: gate.baseUrlFuture,
    timeout: 10_000
})


async function getGateFuturesData<T>(
    url: string | undefined,
    params?: ApiRequestParam
): Promise<T> {
    if (!url) throw new Error("Gate endpoint undefined")
    const res = await httpGateFutures.get<T>(url, { ...params, headers: {'Accept': 'application/json', 'Content-Type': 'application/json'} })
    return res.data
}

export async function getGateFutureTicker(params?: ApiRequestParam) {
    return getGateFuturesData<any>(gate.endpoints.ticker, {
        contract: params?.symbol
    })
}

export async function getGateFutureKlines(params?: ApiRequestParam) {
    return getGateFuturesData<any>(gate.endpoints.klines, {
        contract: params?.symbol,
        interval: params?.interval ?? "1m",
        limit: params?.limit ?? 100
    })
}

export async function getGateFutureOrderbook(params?: ApiRequestParam) {
    return getGateFuturesData<any>(gate.endpoints.orderbook, {
        contract: params?.symbol,
        limit: params?.limit ?? 50
    })
}

export async function getGateFutureOpenInterest(params?: ApiRequestParam) {
    return getGateFuturesData<any>(gate.endpoints.openInterest, {
        contract: params?.symbol
    })
}


export async function getGateFutureFundingRate(params?: ApiRequestParam) {
    const now = Date.now()

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)

    return getGateFuturesData<any>(gate.endpoints.fundingRate +"?contract="+gateSymbol(params?.symbol))
}


export async function getGateFutureSymbols() {
    return getGateFuturesData<any>(gate.endpoints.symbols)
}


