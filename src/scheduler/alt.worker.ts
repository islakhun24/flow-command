import { getMarketContext } from "../market/market.service"
import { buildSignal } from "../engine/signal.engine"
import { sendSignalAlert } from "../alert/signal.alert"
import { tryAutoTrade } from "../engine/autoTrade.engine"
import { MarketSnapshot } from "../types/market"

export async function scanAltSymbol(
    symbol: string,
    btcCtx: MarketSnapshot
) {
    const altCtx = await getMarketContext(symbol)

    // BTC-SYNC RULE
    const sameDirection =
        (btcCtx.sweepDown && altCtx.sweepDown) ||
        (btcCtx.sweepUp && altCtx.sweepUp)

    if (!sameDirection) return

    const signal = buildSignal(altCtx, btcCtx)

    if (!signal) return

    await sendSignalAlert(signal)
    await tryAutoTrade(signal)
}
