import {getBinanceFutureFundingRate, getBinanceFutureOpenInterest} from "./binance.market";
import {getBitmexFundingRate} from "./bitmex.market";
import {fetchBybitFundingHistory, fetchBybitOpenInterest} from "./bybit.market";
import {getDeltaFundingRate} from "./delta.market";
import {getDeribitFundingRate} from "./deribit.market";
import {getGateFutureFundingRate, getGateFutureOpenInterest} from "./gate.market";
import {getHuobiFutureFundingRate, getHuobiFutureOpenInterest} from "./huobi.market";
import {getHyperliquidFunding} from "./hyperliquid.market";
import {getKucoinFutureFundingRate, getKucoinFutureOpenInterest} from "./kukocin.market";
import {getOkxFutureFundingRate, getOkxFutureOpenInterest} from "./okx.market";
import {getPhemexFundingRate} from "./phemex.market";
import {usdtToUsdSwap} from "../utils/okx.util";

export async function getMarketFundingRates(symbol: string, interval: string = "4h", limit: number = 100) {
    const [
        binance,
        // bitmex,
        bybit,
        // delta, ws
        // deribit,
        gate,
        huobi,
        // hyperliquid,
        kucoin,
        okx,
        phemex
    ] = await Promise.all([
        getBinanceFutureFundingRate({ symbol }),
        // getBitmexFundingRate({ symbol }),
        fetchBybitFundingHistory({
            symbol, intervalTime: interval, limit
        }),
        // getDeltaFundingRate({ symbol }), ws
        // getDeribitFundingRate({ symbol }),
        getGateFutureFundingRate({ symbol }),
        getHuobiFutureFundingRate({ symbol }),
        // getHyperliquidFunding(symbol),
        getKucoinFutureFundingRate({ symbol }),
        getOkxFutureFundingRate(usdtToUsdSwap(symbol)),
        // getPhemexFundingRate({ symbol }),
    ])
    return {
        symbol,
        binance: binance[0],
        // bitmex: bitmex,
        bybit: bybit[0],
        // delta,
        // deribit,
        gate: gate[0],
        huobi,
        // hyperliquid,
        kucoin: kucoin[0],
        okx: okx[0],
        // phemex,
    }
}

export async function getOpenInterestRates(symbol: string, interval: string = "4h", limit: number = 100) {
    const [
        binance,
        bybit,
        huobi,
        // hyperliquid,
        kucoin,
        okx,
    ] = await Promise.all([
        getBinanceFutureOpenInterest({
            symbol,
            period: interval
        }),
        fetchBybitOpenInterest({
            symbol, intervalTime: interval, limit
        }),
        getHuobiFutureOpenInterest({symbol}),
        getKucoinFutureOpenInterest({ symbol }),
        getOkxFutureOpenInterest({symbol: usdtToUsdSwap(symbol)})
    ])

    return {
        symbol,
        binance: binance[0],
        bybit: bybit[0],
        huobi,
        kucoin: kucoin[0],
        okx: okx[0],
    }
}
