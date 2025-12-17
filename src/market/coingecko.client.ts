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
