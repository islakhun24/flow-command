export function gateSymbol(symbol: string): string {
    const match = symbol.match(/^([A-Z0-9]+)(USDT|USDC|BUSD|USD)$/)

    if (!match) {
        throw new Error(`Invalid symbol: ${symbol}`)
    }

    const [, base, quote] = match
    return `${base}_${quote}`}
