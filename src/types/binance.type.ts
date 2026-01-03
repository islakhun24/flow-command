export interface OIBinanceResponse {
    symbol: string
    sumOpenInterest: string
    sumOpenInterestValue: string
    CMCCirculatingSupply: string
    timestamp: number
}

export interface LSBinanceResponse {
    symbol: string
    longAccount: string
    longShortRatio: string
    shortAccount: string
    timestamp: number
}

export interface FundingRateBinanceResponse {
    symbol: string
    fundingTime: number
    fundingRate: string
    markPrice: string
}

export interface TickerBinanceResponse {
    symbol: string;
    priceChange: string;
    priceChangePercent: string;
    weightedAvgPrice: string;
    lastPrice: string;
    lastQty: string;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
    volume: string;
    quoteVolume: string;
    openTime: number;
    closeTime: number;
    firstId: number;
    lastId: number;
    count: number;
}

export interface OrderBookBinanceResponse {
    lastUpdateId: number;
    E: number; // Event time
    T: number; // Transaction time
    bids: [string, string][]; // [price, quantity]
    asks: [string, string][]; // [price, quantity]
}

export interface MarkPriceBinanceResponse {
    symbol: string;
    markPrice: string;
    indexPrice: string;
    estimatedSettlePrice: string;
    lastFundingRate: string;
    interestRate: string;
    nextFundingTime: number;
    time: number;
}

export interface AggregateTradeBinanceResponse {
    a: number;   // Aggregate tradeId
    p: string;   // Price
    q: string;   // Quantity
    f: number;   // First tradeId
    l: number;   // Last tradeId
    T: number;   // Timestamp
    m: boolean;  // Is buyer the maker
}

export interface KlineBinanceResponse {
    openTime: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    closeTime: number;
    quoteVolume: number;
    tradeCount: number;
    takerBuyBaseVolume: number;
    takerBuyQuoteVolume: number;
    ignore: string;
}
