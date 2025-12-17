import axios from "axios"

const BINANCE_FAPI = process.env.BINANCE_FUTURES_URL!

const http = axios.create({
    baseURL: BINANCE_FAPI,
    timeout: 10_000
})

async function get<T>(url: string, params?: any): Promise<T> {
    const res = await http.get<T>(url, { params })
    return res.data
}

/* =========================
   PRICE & KLINES
========================= */

export async function getKlines(
    symbol: string,
    interval: "1m" | "5m",
    limit = 100
) {
    return get<any[]>("/fapi/v1/klines", { symbol, interval, limit })
}

/* =========================
   OPEN INTEREST
========================= */

export async function getOpenInterest(symbol: string) {
    return get<{ openInterest: string }>("/fapi/v1/openInterest", { symbol })
}

/* =========================
   LONG SHORT RATIO
========================= */

export async function getLSRetail(symbol: string) {
    return get<any[]>("/futures/data/globalLongShortAccountRatio", {
        symbol,
        period: "5m",
        limit: 1
    })
}

export async function getLSTopTrader(symbol: string) {
    return get<any[]>("/futures/data/topLongShortPositionRatio", {
        symbol,
        period: "5m",
        limit: 1
    })
}

/* =========================
   ORDER BOOK
========================= */

export async function getOrderBook(symbol: string, limit = 100) {
    return get<{ bids: string[][]; asks: string[][] }>(
        "/fapi/v1/depth",
        { symbol, limit }
    )
}

/* =========================
   SYMBOL LIST
========================= */

export async function getAllPerpetualSymbols(): Promise<string[]> {
    const data = await get<any>("/fapi/v1/exchangeInfo")
    return data.symbols
        .filter((s: any) => s.contractType === "PERPETUAL")
        .map((s: any) => s.symbol)
}
