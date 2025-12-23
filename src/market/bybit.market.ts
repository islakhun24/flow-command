import {API_CONSTANTS} from "../config/api.constant";
import axios from "axios";
import {BybitCategory} from "../types/bybit.type";

const BASE = API_CONSTANTS.BYBIT.baseUrlFuture
const EP = API_CONSTANTS.BYBIT.endpoints


interface BiybitPayload {
    category?: 'linear'
    symbol?: string
    intervalTime?: string
    startTime?: number
    endTime?: number
    limit?: number
    interval?: number
    period?: string
}

const http = axios.create({
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
})

export async function fetchBybitSymbols(payload: BiybitPayload) {
    const { data } = await http.get(`${BASE}${EP.symbols}`, {
        params: {
            category: 'linear',
            symbol: payload.symbol,
            intervalTime: payload.intervalTime,
            limit: payload.limit }

    })
    return data.result.list
}

export async function fetchBybitTicker(payload: BiybitPayload) {
    const { data } = await http.get(`${BASE}${EP.ticker}`, {
        params: {
            category: 'linear',
            symbol: payload.symbol,
            intervalTime: payload.intervalTime,
            limit: payload.limit
        }

    })
    return data.result.list[0]
}

/* =========================
   KLINES
========================= */
export async function fetchBybitKlines(payload: BiybitPayload) {
    const { data } = await http.get(`${BASE}${EP.klines}`, {
        params: {
            category: 'linear',
            symbol: payload.symbol,
            interval: payload.interval,
            limit: payload.limit
        }
    })

    return data.result.list.map((k: any[]) => ({
        start: Number(k[0]),
        open: Number(k[1]),
        high: Number(k[2]),
        low: Number(k[3]),
        close: Number(k[4]),
        volume: Number(k[5])
    }))
}

export async function fetchBybitOrderbook(payload: BiybitPayload) {
    const { data } = await http.get(`${BASE}${EP.orderbook}`, {
        params: {
            category: 'linear',
            symbol: payload.symbol,
            intervalTime: payload.intervalTime,
            limit: payload.limit }
    })

    return data.result
}

export async function fetchBybitOpenInterest(payload: BiybitPayload) {
    const { data } = await http.get(`${BASE}${EP.openInterest}`, {
        params: {
            category: 'linear',
            symbol: payload.symbol,
            intervalTime: payload.intervalTime,
            limit: payload.limit
        }
    })

    return data.result.list
}

export async function fetchBybitFundingHistory(payload: BiybitPayload) {
    const { data } = await http.get(`${BASE}${EP.fundingRateHist}`, {
        params: { category: 'linear', symbol: payload.symbol, limit: payload.limit }
    })

    return data.result.list
}

export async function fetchBybitLongShortRatio(payload: BiybitPayload) {
    const { data } = await http.get(`${BASE}${EP.longShortGlobal}`, {
        params: { category: 'linear', period: payload.period, symbol: payload.symbol, limit: payload.limit }
    })

    return data.result.list
}
