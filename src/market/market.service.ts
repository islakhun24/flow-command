import {
    getKlines,
    getOpenInterest,
    getLSRetail,
    getLSTopTrader,
    getOrderBook
} from "./binance.client"

import { fetchMarketCaps } from "./coingecko.client"
import {MarketSnapshot} from "../types/market";
import {checkBTCValidity} from "./btc.service";

let marketCapCache: Record<string, number> = {}

/* =========================
   CACHE MCAP
========================= */

export async function loadMarketCaps() {
    marketCapCache = await fetchMarketCaps()
    console.log("Market cap loaded:", Object.keys(marketCapCache).length)
}

export function getMarketCap(symbol: string): number | null {
    const base = symbol.replace("USDT", "")
    return marketCapCache[base] ?? null
}

/* =========================
   SNAPSHOT MARKET
========================= */

export async function getMarketSnapshot(symbol: string) {
    const [
        klines1m,
        klines5m,
        oi,
        lsRetail,
        lsTop,
        orderbook
    ] = await Promise.all([
        getKlines(symbol, "1m", 100),
        getKlines(symbol, "5m", 100),
        getOpenInterest(symbol),
        getLSRetail(symbol),
        getLSTopTrader(symbol),
        getOrderBook(symbol)
    ])

    return {
        symbol,
        price: parseFloat(klines1m.at(-1)?.[4]),
        klines1m,
        klines5m,
        openInterest: parseFloat(oi.openInterest),
        lsRetail: parseFloat(lsRetail[0]?.longShortRatio),
        lsTopTrader: parseFloat(lsTop[0]?.longShortRatio),
        orderbook,
        marketCap: getMarketCap(symbol)
    }
}

export async function getMarketContext(symbol: string): Promise<MarketSnapshot> {
    const snap = await getMarketSnapshot(symbol)

    const btcValid = await checkBTCValidity()

    return {
        ...snap,
        btcValid
    } as MarketSnapshot
}

export function buildMarketContextFromSlice(
    symbol: string,
    slice: any[]
): any {

    const last = slice[slice.length - 1]
    const prev = slice[slice.length - 2]

    const open = +last.open
    const close = +last.close
    const high = +last.high
    const low = +last.low
    const volume = +last.volume

    const prevHigh = +prev.high
    const prevLow = +prev.low

    // =============================
    // 1. PRICE & RANGE
    // =============================
    const price = close
    const range = high - low

    // =============================
    // 2. SWEEP DETECTION (CORE)
    // =============================
    const bodyHigh = Math.max(open, close)
    const bodyLow = Math.min(open, close)

    const wickUp = high - bodyHigh
    const wickDown = bodyLow - low

    const sweepUp =
        high > prevHigh &&
        wickUp > range * 0.4 &&
        close < prevHigh

    const sweepDown =
        low < prevLow &&
        wickDown > range * 0.4 &&
        close > prevLow

    // =============================
    // 3. VOLUME ACTIVITY
    // =============================
    const avgVolume =
        slice.slice(0, -1).reduce((a, c) => a + +c.volume, 0) /
        (slice.length - 1)

    const volumeSpike = volume > avgVolume * 1.8

    // =============================
    // 4. LONG SHORT (RECONSTRUCTED)
    // =============================
    let lsRetail = 1
    let lsTop = 1

    if (wickDown > wickUp * 1.5) {
        lsRetail = 0.7   // retail short trapped
        lsTop = 0.9
    }

    if (wickUp > wickDown * 1.5) {
        lsRetail = 1.3   // retail long trapped
        lsTop = 1.1
    }

    // =============================
    // 5. OPEN INTEREST DELTA (LOGIC)
    // =============================
    let oiDelta = 0

    if ((sweepUp || sweepDown) && volumeSpike) {
        oiDelta = 1      // liquidation + re-entry
    } else if (volumeSpike) {
        oiDelta = 0.5
    } else {
        oiDelta = -0.2   // posisi keluar / wait
    }

    // =============================
    // 6. CONFIDENCE BASE
    // =============================
    let confidenceBase = 0

    if (sweepUp || sweepDown) confidenceBase += 30
    if (volumeSpike) confidenceBase += 20
    if (oiDelta > 0) confidenceBase += 20
    if (lsRetail < 0.8 || lsRetail > 1.2) confidenceBase += 15

    confidenceBase = Math.min(100, confidenceBase)

    return {
        symbol,
        timestamp: last.closeTime,

        price,
        high,
        low,
        range,

        sweepUp,
        sweepDown,

        lsRetail,
        lsTop,
        oiDelta,

        volume,
        volumeSpike,

        confidenceBase
    }
}


export async function getHistoricalSnapshots(
    symbol: string,
    limit = 500
): Promise<MarketSnapshot[]> {

    const klines = await getKlines(symbol, "1m", limit)
    const snapshots: MarketSnapshot[] = []

    for (let i = 30; i < klines.length; i++) {
        const slice = klines.slice(i - 30, i)
        console.log(slice)
        const snapshot = buildMarketContextFromSlice(symbol, slice)
        snapshots.push(snapshot)
    }

    return snapshots
}


