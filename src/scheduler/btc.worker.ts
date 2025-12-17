import { getMarketContext } from "../market/market.service"
import {MarketSnapshot} from "../types/market";

let lastBTCContext: MarketSnapshot | null = null
let lastValidAt = 0

const BTC_VALID_TTL = 3 * 60 * 1000 // 3 menit

export async function updateBTCContext(): Promise<MarketSnapshot | null> {
    const ctx = await getMarketContext("BTCUSDT")

    const btcValid =
        ctx.oiDelta > 0 &&
        (
            (ctx.sweepDown && ctx.lsRetail < 0.95) ||
            (ctx.sweepUp && ctx.lsRetail > 1.05)
        )

    if (btcValid) {
        lastBTCContext = { ...ctx, btcValid: true }
        lastValidAt = Date.now()
    }

    if (Date.now() - lastValidAt > BTC_VALID_TTL) {
        return null
    }

    return lastBTCContext
}
