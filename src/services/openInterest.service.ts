import {getMarketFundingRates, getOpenInterestRates} from "../market/market";
import {getBinanceFutureOpenInterestHist} from "../market/binance.market";
import {buildOIRawSource} from "../utils/oi.util";
import {fetchBybitOpenInterest} from "../market/bybit.market";
import {oiConverterBinanceToGlobal} from "../utils/binance.util";

export async function openInterestService(symbol: string | undefined, interval: string | undefined, limit: number | undefined) {
    const binanceOIData = await getBinanceFutureOpenInterestHist({symbol, period:interval, limit});
    const bybitOIData = await fetchBybitOpenInterest({symbol, intervalTime:interval, limit});
    const okxOIData = await fetchBybitOpenInterest({symbol, intervalTime:interval, limit});
    console.log("OpenInterestService successfully open", okxOIData);
    const binanceOI = buildOIRawSource("BINANCE", oiConverterBinanceToGlobal(binanceOIData))
    const bybitOI = buildOIRawSource("BYBIT", bybitOIData)

    return {
        symbol,
        timeframe: interval,
        limit,
        exchanges: [binanceOI, bybitOI]
    }
    // const o/
}
