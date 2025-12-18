import axios from "axios"

const BINANCE_API = process.env.BINANCE_SPOT_URL!

const http = axios.create({
    baseURL: BINANCE_API,
    timeout: 10_000
})

async function getSpot<T>(url: string, params?: any): Promise<T> {
    const res = await http.get<T>(url, { params })
    return res.data
}

export async function getSpotTrades(symbol: string, limit = 1000) {
    const data  = await getSpot(`/api/v3/trades`, {
        params: { symbol, limit }
    })
    return data
}
