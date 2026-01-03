// Market State
export enum MarketState {
    DOMINANT = "DOMINANT",
    FLUSH = "FLUSH",
    FLAT = "FLAT",
    REBUILD = "REBUILD"
}

// Bias Arah
export enum Bias {
    LONG = "LONG",
    SHORT = "SHORT",
    NONE = "NONE"
}

// Final Action
export enum Action {
    ENTER_LONG = "ENTER_LONG",
    ENTER_SHORT = "ENTER_SHORT",
    WAIT = "WAIT"
}

export interface EngineInput {
    oiData: number[]              // 20 data terakhir
    fundingRateData: number[]
    globalRatioData: number[]
    topPositionRatioData: number[]
    topAccountRatioData: number[]
    klineClose: number[]
    klineHigh: number[]
    klineLow: number[]
    tradesAggBuyVol: number[]
    tradesAggSellVol: number[]
    orderBookBidVol: number
    orderBookAskVol: number
}


