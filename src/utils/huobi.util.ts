
import { LSRawItem } from "../types/ls.type"

export function huobiContractCode(symbol: string): string {
    const match = symbol.match(/^([A-Z0-9]+)(USDT|USDC|BUSD|USD)$/)

    if (!match) {
        throw new Error(`Invalid symbol: ${symbol}`)
    }

    const [, base, quote] = match
    return `${base}-${quote}`
}


export function mapBuySellRatioToLSHuobi(
    apiData?: any[]
): LSRawItem[] {

    if (!Array.isArray(apiData)) return []

    return apiData.map<LSRawItem>(d => {
        const buy = d?.buy_ratio
        const sell = d?.sell_ratio

        return {
            timestamp: d?.ts != null ? Number(d.ts) : null,

            longAccount: buy != null ? Number(buy) : null,
            shortAccount: sell != null ? Number(sell) : null,

            longShortRatio:
                buy != null && sell != null && Number(sell) !== 0
                    ? Number(buy) / Number(sell)
                    : null,

            longPosition: null,
            shortPosition: null
        }
    })
}

export function normalizeTimeframeHuobi(tf: string): string {
    const map: Record<string, string> = {
        "5min": "5min",
        "15min": "15min",
        "30min": "30min",
        "1h": "60min",
        "4h": "4hour",
        "1d": "1day"
    }

    return map[tf] ?? tf
}
