import axios from "axios"

const http = axios.create({
    baseURL: "https://api.coingecko.com/api/v3",
    timeout: 15_000
})

export type MarketCapMap = Record<string, number>

export async function fetchMarketCaps(): Promise<MarketCapMap> {
    const res = await http.get<any[]>(
        "/coins/markets",
        {
            params: {
                vs_currency: "usd",
                order: "market_cap_desc",
                per_page: 250,
                page: 1
            }
        }
    )

    const map: MarketCapMap = {}

    for (const c of res.data) {
        if (c.symbol && c.market_cap) {
            map[c.symbol.toUpperCase()] = c.market_cap
        }
    }

    return map
}

const cache = new Map<string, number>()

export async function getMarketCapUsd(symbol: string): Promise<number> {
    const key = symbol.replace("USDT", "").toLowerCase()
    if (cache.has(key)) return cache.get(key)!

    const { data } = await http.get(`/coins/markets`, {
        params: { vs_currency: "usd", symbols: key }
    })

    const mcap = data?.[0]?.market_cap ?? 0
    cache.set(key, mcap)
    return mcap
}

export async function getCoinDetail(symbol: string): Promise<number> {
    const key = symbol.replace("USDT", "").toLowerCase()
    if (cache.has(key)) return cache.get(key)!

    const { data } = await http.get(`/coins/markets`, {
        params: { vs_currency: "usd", symbols: key }
    })

    return data?.[0]
}

export async function getCoinDetail(symbol: string): Promise<number> {
    const key = symbol.replace("USDT", "").toLowerCase()
    if (cache.has(key)) return cache.get(key)!

    const { data } = await http.get(`/coins/markets`, {
        params: { vs_currency: "usd", symbols: key }
    })

    return data?.[0]
}

export async function getCoinList(): Promise<any> {
    const {data} = await http.get(`/coins/list`)
    return data
}


export async function getMultipleCoin(batchIds: string){
    console.log("DDD")
    const { data } = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
        params: { vs_currency: "usd", ids: batchIds }
    });

    return data
}
