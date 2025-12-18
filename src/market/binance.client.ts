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
    interval = "4h",
    limit = 20
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

export async function getFundingRate(symbol: string) {
    const data = await get("/fapi/v1/fundingRate", { symbol, limit: 1 })
    return data[0]
}

export async function getLSRetail(symbol: string) {
    return get<any[]>("/futures/data/globalLongShortAccountRatio", {
        symbol,
        period: "4h",
        limit: 20
    })
}

export async function getLSTopTrader(symbol: string) {
    return get<any[]>("/futures/data/topLongShortPositionRatio", {
        symbol,
        period: "4h",
        limit: 20
    })
}

export async function getLSTopTraderAccount(symbol: string) {
    return get<any[]>("/futures/data/topLongShortAccountRatio", {
        symbol,
        period: "4h",
        limit: 20
    })
}

/* =========================
   ORDER BOOK
========================= */

export async function getOrderBook(symbol: string, limit = 100) {
    return get<{ bids: string[][]; asks: string[][] }>(
        "/fapi/v1/depth",
        { symbol, period: "4h",
            limit: limit }
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

export async function getAllFuturesSymbols(): Promise<string[]> {
    const data  = await get("/fapi/v1/exchangeInfo")

    return data.symbols
        .filter(
            (s: any) =>
                s.contractType === "PERPETUAL" &&
                s.quoteAsset === "USDT" &&
                s.status === "TRADING"
        )
        .map((s: any) => s.symbol)
}

export async function getNotionalOpenInterest(
    symbol: string,
    interval = "4h",
    limit = 20
) {
    const data = await get(
        "/futures/data/openInterestHist",
        {
            symbol: symbol,
            period: interval,
            limit: limit
        }
    )

    return data.map((d: any) => ({
        notional: Number(d.sumOpenInterestValue),
        timestamp: d.timestamp
    }))
}
