import {Action, Bias, EngineInput, MarketState} from "../types/pairAnalysis.type";
import {
    detectBias,
    detectMarketState,
    entryConfirmation,
    parseAggTrades, parseFunding, parseKline, parseLSRatio, parseOI,
    parseOrderBook
} from "../utils/pairAnalysis.util";
import {
    AggregateTradeBinanceResponse,
    FundingRateBinanceResponse, KlineBinanceResponse,
    LSBinanceResponse,
    OIBinanceResponse,
    OrderBookBinanceResponse
} from "../types/binance.type";

import { Action, Bias, EngineInput, MarketState } from "../types/pairAnalysis.type"
import {
    detectBias,
    detectMarketState,
    entryConfirmation,
    calcConfidence
} from "../utils/pairAnalysis.util"

export function tradingEngine(input: EngineInput) {
    const state = detectMarketState(input)

    const tradable =
        state === MarketState.REBUILD ||
        state === MarketState.DOMINANT

    if (!tradable) {
        return {
            marketState: state,
            action: Action.WAIT,
            confidence: 0
        }
    }

    const bias = detectBias(input)
    if (bias === Bias.NONE) {
        return {
            marketState: state,
            action: Action.WAIT,
            confidence: 0
        }
    }

    const confirmed = entryConfirmation(bias, input)
    if (!confirmed) {
        return {
            marketState: state,
            action: Action.WAIT,
            confidence: 0
        }
    }

    const confidence = calcConfidence(bias, state, input)

    if (confidence < 0.65) {
        return {
            marketState: state,
            action: Action.WAIT,
            confidence
        }
    }

    return {
        marketState: state,
        action: bias === Bias.LONG
            ? Action.ENTER_LONG
            : Action.ENTER_SHORT,
        confidence
    }
}


export function buildEngineInput(params: {
    oiData: OIBinanceResponse[]
    globalRatioData: LSBinanceResponse[]
    topPositionRatioData: LSBinanceResponse[]
    topAccountRatioData: LSBinanceResponse[]
    fundingRateData: FundingRateBinanceResponse[]
    orderBookData: OrderBookBinanceResponse
    tradesAggData: AggregateTradeBinanceResponse[]
    klineData: KlineBinanceResponse[]
}): EngineInput {

    const { close, high, low } = parseKline(params.klineData)
    const { buyVol, sellVol } = parseAggTrades(params.tradesAggData)
    const { bidVol, askVol } = parseOrderBook(params.orderBookData)


    return {
        oiData: parseOI(params.oiData),
        fundingRateData: parseFunding(params.fundingRateData),
        globalRatioData: parseLSRatio(params.globalRatioData),
        topPositionRatioData: parseLSRatio(params.topPositionRatioData),
        topAccountRatioData: parseLSRatio(params.topAccountRatioData),
        klineClose: close,
        klineHigh: high,
        klineLow: low,
        tradesAggBuyVol: buyVol,
        tradesAggSellVol: sellVol,
        orderBookBidVol: bidVol,
        orderBookAskVol: askVol
    }
}

