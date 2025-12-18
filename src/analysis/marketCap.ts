export type MarketCapClass = "MICRO" | "SMALL" | "MID" | "LARGE"

export function getMarketCapClass(mcap: number): MarketCapClass {
    if (mcap < 20_000_000) return "MICRO"
    if (mcap < 100_000_000) return "SMALL"
    if (mcap < 1_000_000_000) return "MID"
    return "LARGE"
}

export const weight = {
    derivatives: { MICRO: 0.3, SMALL: 0.5, MID: 0.8, LARGE: 1 },
    atr: { MICRO: 0.4, SMALL: 0.6, MID: 0.8, LARGE: 1 },
    ls: { MICRO: 0.3, SMALL: 0.5, MID: 0.8, LARGE: 1 },
    spot: { MICRO: 0.5, SMALL: 0.7, MID: 0.9, LARGE: 1.2 },
    priceEff: { MICRO: 0.3, SMALL: 0.5, MID: 0.8, LARGE: 1 }
}
