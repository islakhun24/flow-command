import {
    getBinanceAggTrades,
    getBinanceFutureFundingRate, getBinanceFutureKline, getBinanceFutureLiquidationsOrder,
    getBinanceFutureLongShortGlobal, getBinanceFutureLongShortTopAccount,
    getBinanceFutureLongShortTopPosition, getBinanceFutureMarkPrice,
    getBinanceFutureOpenInterestHist, getBinanceFutureOrderbook, getBinanceFutureTicker
} from "../market/binance.market";
import {
    AggregateTradeBinanceResponse,
    FundingRateBinanceResponse,
    LSBinanceResponse, MarkPriceBinanceResponse,
    OIBinanceResponse,
    OrderBookBinanceResponse, TickerBinanceResponse,
} from "../types/binance.type";
import {parseKlineBinance} from "../utils/binance.util";
import {buildEngineInput, tradingEngine} from "../engine/pairAnalysis.engine";
import {EngineInput} from "../types/pairAnalysis.type";
import {BinanceWS} from "../market/ws/binance.ws";

export async function pairAnalysisService(symbol: string | undefined, interval: string | undefined, limit: number | undefined) {
    // OI
    const oiData: OIBinanceResponse[] = await getBinanceFutureOpenInterestHist({symbol, period:interval, limit});

    // LS RATIO
    const globalRatioData: LSBinanceResponse[] = await getBinanceFutureLongShortGlobal({
        symbol: symbol,
        period: interval,
        limit: limit
    })

    const topPositionRatioData: LSBinanceResponse[] = await getBinanceFutureLongShortTopPosition({
        symbol: symbol,
        period: interval,
        limit: limit
    })

    const topAccountRatioData: LSBinanceResponse[] = await getBinanceFutureLongShortTopAccount({
        symbol: symbol,
        period: interval,
        limit: limit
    })

    // FUNDING Rate
    const fundingRateData: FundingRateBinanceResponse[] = await  getBinanceFutureFundingRate({
        symbol: symbol,
        period: interval,
        limit: limit
    })

    //Ticker
    const tickerData: TickerBinanceResponse = await getBinanceFutureTicker({symbol})

    //Orderbook
    const orderBookData: OrderBookBinanceResponse = await getBinanceFutureOrderbook({
        symbol: symbol,
        period: interval,
        limit: limit
    })

    //MarkPrice
    const markpriceData: MarkPriceBinanceResponse = await getBinanceFutureMarkPrice({
        symbol: symbol,
        period: interval,
        limit: limit
    })

    // TRADES
    const tradesAggData: AggregateTradeBinanceResponse[] = await getBinanceAggTrades({
        symbol: symbol,
        period: interval,
        limit: limit
    })

    // Klines
    const klineData: any[] = (await getBinanceFutureKline({
        symbol: symbol,
        period: interval,
        limit: limit
    }))?.map(item => parseKlineBinance(item))

    const engineInput: EngineInput =  buildEngineInput(
    {
        oiData,
            globalRatioData,
            topPositionRatioData,
            topAccountRatioData,
            fundingRateData,
            orderBookData,
            tradesAggData,
            klineData
    })

    const ws = new BinanceWS({
        symbol: "BTCUSDT",
        streams: [
            "aggTrade",
            "depth20@100ms",
            "markPrice",
            "openInterest"
        ],
        onMessage: (data, stream) => {
            if (stream.includes("aggTrade")) {
                const side = data.m ? "SELL" : "BUY"
                console.log("Agg", side, data.p, data.q)
            }

            if (stream.includes("depth")) {
                console.log("Orderbook", data.b?.[0], data.a?.[0])
            }

            if (stream.includes("markPrice")) {
                console.log("Funding", data.r)
            }

            if (stream.includes("openInterest")) {
                console.log("OI", data.oi)
            }
        }
    })

    ws.connect()

    const result = tradingEngine(engineInput)

    return {
        symbol: symbol,
        analysis: result
    }
}
