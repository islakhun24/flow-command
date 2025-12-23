import {getLSRetail} from "../market/binance.client";
import {
    getBinanceFutureLongShortGlobal,
    getBinanceFutureLongShortTopAccount,
    getBinanceFutureLongShortTopPosition
} from "../market/binance.market";
import {LSPerExchange, LSRawResponse} from "../types/ls.type";
import {buildLSRawSource} from "../engine/ls.engine";
import {fetchBybitLongShortRatio} from "../market/bybit.market";
import {mapBuySellToLSBybit} from "../types/bybit.type";
import {LSemptyGenerator} from "../utils/ls.util";
import {getHuobiFutureTopTraderAccount, getHuobiFutureTopTraderPosition} from "../market/huobi.market";
import {mapBuySellRatioToLSHuobi} from "../utils/huobi.util";

export async function LsRatioService(symbol: string | undefined, interval: string | undefined, limit: number | undefined) {
    const binanceGlobalRatioData = await getBinanceFutureLongShortGlobal({
        symbol: symbol,
        period: interval,
        limit: limit
    })

    const binanceTopPositionRatioData = await getBinanceFutureLongShortTopPosition({
        symbol: symbol,
        period: interval,
        limit: limit
    })

    const binanceTopAccountRatioData = await getBinanceFutureLongShortTopAccount({
        symbol: symbol,
        period: interval,
        limit: limit
    })

    const binanceExchange: LSPerExchange = {
        exchange: "BINANCE",

        global: buildLSRawSource(
            "GLOBAL",
            binanceGlobalRatioData
        ),

        topAccount: buildLSRawSource(
            "TOP_ACCOUNT",
            binanceTopAccountRatioData
        ),

        topPosition: buildLSRawSource(
            "TOP_POSITION",
            binanceTopPositionRatioData
        )
    }

    const bybitLSGlobalRatioData = await fetchBybitLongShortRatio({
        limit,
        period: interval,
        symbol
    })
    const rawGlobalDataBybit = mapBuySellToLSBybit(bybitLSGlobalRatioData)

    const biybitExchange: LSPerExchange = {
        exchange: "BYBIT",
        global: buildLSRawSource(
            "GLOBAL",
            rawGlobalDataBybit
        ),
        ...LSemptyGenerator('OKX', ["TOP_POSITION", "TOP_ACCOUNT"])
    }

    const okxExchange: LSPerExchange = LSemptyGenerator('OKX', ['GLOBAL', "TOP_POSITION", "TOP_ACCOUNT"])
    const bitgetExchange: LSPerExchange = LSemptyGenerator('BITGET', ['GLOBAL', "TOP_POSITION", "TOP_ACCOUNT"])
    const mexcExchange: LSPerExchange = LSemptyGenerator('MEXC', ['GLOBAL', "TOP_POSITION", "TOP_ACCOUNT"])
    const gateExchange: LSPerExchange = LSemptyGenerator('GATE', ['GLOBAL', "TOP_POSITION", "TOP_ACCOUNT"])
    const kucoinExchange: LSPerExchange = LSemptyGenerator('KUCOIN', ['GLOBAL', "TOP_POSITION", "TOP_ACCOUNT"])
    const bitmexExchange: LSPerExchange = LSemptyGenerator('BITMEX', ['GLOBAL', "TOP_POSITION", "TOP_ACCOUNT"])

    const huobiLSTopTraderAccountRatioData = await getHuobiFutureTopTraderAccount({
        period: interval,
        symbol
    })
    const huobiLSTopTraderPositionRatioData = await getHuobiFutureTopTraderPosition({
        period: interval,
        symbol
    })

    const huobiLSTopTraderPositionRatioDataRaw = mapBuySellRatioToLSHuobi(huobiLSTopTraderPositionRatioData)
    const huobiLSTopTraderAccountRatioDataRaw = mapBuySellRatioToLSHuobi(huobiLSTopTraderAccountRatioData)

    console.log("huobiLSTopTraderPositionRatioDataRaw", huobiLSTopTraderPositionRatioDataRaw)
    const huobiExchange: LSPerExchange = {
        exchange: "HUOBI",
        topAccount: buildLSRawSource('TOP_ACCOUNT', huobiLSTopTraderAccountRatioDataRaw),
        topPosition: buildLSRawSource('TOP_POSITION', huobiLSTopTraderPositionRatioDataRaw),
        ...LSemptyGenerator('HUOBI', ["GLOBAL"])
    }
    return {
        symbol,
        timeframe: interval,
        limit,
        exchanges: [binanceExchange, biybitExchange, okxExchange, bitgetExchange, mexcExchange,gateExchange, kucoinExchange, huobiExchange, bitmexExchange]
    }
}
