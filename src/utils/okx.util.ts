export function usdtToUsdSwap(symbol: string): string {
    if (!symbol.endsWith("USDT")) {
        throw new Error(`Invalid USDT symbol: ${symbol}`)
    }

    const base = symbol.replace("USDT", "")
    return `${base}-USD-SWAP`
}
