import {ExchangeApiConfig} from "../types/futuresApi.type";

export const EXCHANGES = [
    "BINANCE",
    "HYPERLIQUID",
    "BYBIT",
    "OKX",
    "BITGET",
    "MEXC",
    "GATE",
    "KUCOIN",
    "HUOBI",
    "BITMEX",
    "PHEMEX",
    "DERIBIT",
    "DELTA",
] as const

export type Exchange = typeof EXCHANGES[number]

// API_CONSTANTS[exchange].endpoints[key]
export const API_CONSTANTS: Record<Exchange, ExchangeApiConfig> = {
    BINANCE: {
        baseUrlFuture: "https://fapi.binance.com",
        wsUrl: "wss://fstream.binance.com/ws",
        endpoints: {
            symbols: "/fapi/v1/exchangeInfo",
            ticker: "/fapi/v1/ticker/24hr",
            klines: "/fapi/v1/klines",
            orderbook: "/fapi/v1/depth",
            openInterest: "/fapi/v1/openInterest",
            openInterestHist: "/futures/data/openInterestHist",
            fundingRate: "/fapi/v1/fundingRate",
            fundingRateHist: "/futures/data/fundingRate",
            liquidations: "/futures/data/allForceOrders",
            longShortGlobal: "/futures/data/globalLongShortAccountRatio",
            longShortTopAccount: "/futures/data/topLongShortAccountRatio",
            longShortTopPosition: "/futures/data/topLongShortPositionRatio",
            markPrice: "/fapi/v1/premiumIndex"
        }
    },
    HYPERLIQUID: {
        wsUrl: "wss://api.hyperliquid.xyz/ws",
        baseUrlFuture: "https://api.hyperliquid.xyz", // dipakai buat POST JSON-RPC
        endpoints: {
            meta: "meta",
            orderbook: "l2Book",
            trades: "trades",
            openInterest: "openInterest",
            funding: "funding"
        }
    },
    BYBIT: {
        baseUrlFuture: "https://api.bybit.com",
        endpoints: {
            symbols: "/v5/market/instruments-info",
            ticker: "/v5/market/tickers",
            klines: "/v5/market/kline",
            orderbook: "/v5/market/orderbook",
            openInterest: "/v5/market/open-interest",
            fundingRateHist: "/v5/market/funding/history",
            markPrice: "/v5/market/tickers",
            longShortGlobal: '/v5/market/account-ratio'
        }
    },

    OKX: {
        baseUrlFuture: "https://www.okx.com",
        endpoints: {
            symbols: "/api/v5/public/instruments",
            ticker: "/api/v5/market/tickers",
            klines: "/api/v5/market/candles",
            orderbook: "/api/v5/market/books",
            openInterest: "/api/v5/public/open-interest",
            fundingRate: "/api/v5/public/funding-rate",
            markPrice: "/api/v5/public/mark-price"
        }
    },

    BITGET: {
        baseUrlFuture: "https://api.bitget.com",
        endpoints: {
            symbols: "/api/mix/v1/market/contracts",
            ticker: "/api/mix/v1/market/ticker",
            klines: "/api/mix/v1/market/candles",
            orderbook: "/api/mix/v1/market/depth",
            openInterest: "/api/mix/v1/market/open-interest",
            fundingRate: "/api/mix/v1/market/current-fundRate"
        }
    },

    MEXC: {
        baseUrlFuture: "https://contract.mexc.com",
        endpoints: {
            symbols: "/api/v1/contract/detail",
            ticker: "/api/v1/contract/ticker",
            klines: "/api/v1/contract/kline",
            orderbook: "/api/v1/contract/depth",
            openInterest: "/api/v1/contract/open_interest",
            fundingRate: "/api/v1/contract/funding_rate"
        }
    },

    GATE: {
        baseUrlFuture: "https://api.gateio.ws",
        endpoints: {
            symbols: "/api/v4/futures/usdt/contracts",
            ticker: "/api/v4/futures/usdt/tickers",
            klines: "/api/v4/futures/usdt/candlesticks",
            orderbook: "/api/v4/futures/usdt/order_book",
            fundingRate: "/api/v4/futures/usdt/funding_rate"
        }
    },

    KUCOIN: {
        baseUrlFuture: "https://api-futures.kucoin.com",
        endpoints: {
            symbols: "/api/v1/contracts/active",
            ticker: "/api/v1/ticker",
            klines: "/api/v1/kline/query",
            orderbook: "/api/v1/level2/depth",
            openInterest: "/api/v1/openInterest",
            fundingRate: "/api/v1/contract/funding-rates"
        }
    },

    HUOBI: {
        baseUrlFuture: "https://api.hbdm.com",
        endpoints: {
            symbols: "/linear-swap-api/v1/swap_contract_info",
            ticker: "/linear-swap-api/v1/swap_market_detail",
            klines: "/linear-swap-api/v1/swap_kline",
            orderbook: "/linear-swap-api/v1/swap_depth",
            fundingRate: "/linear-swap-api/v1/swap_funding_rate",
            longShortTopPosition: '/linear-swap-api/v1/swap_elite_position_ratio',
            longShortTopAccount: '/linear-swap-api/v1/swap_elite_account_ratio'
        }
    },

    BITMEX: {
        baseUrlFuture: "https://www.bitmex.com/api/v1",
        endpoints: {
            symbols: "/instrument",
            ticker: "/instrument",
            klines: "/trade/bucketed",
            orderbook: "/orderBook/L2",
            fundingRate: "/funding"
        }
    },

    PHEMEX: {
        baseUrlFuture: "https://api.phemex.com",
        endpoints: {
            symbols: "/public/products",
            ticker: "/md/ticker/24hr",
            klines: "/exchange/public/md/kline",
            orderbook: "/md/orderbook",
            fundingRate: "/exchange/public/funding-rate"
        }
    },

    DERIBIT: {
        baseUrlFuture: "https://www.deribit.com/api/v2",
        endpoints: {
            symbols: "/public/get_instruments",
            ticker: "/public/ticker",
            klines: "/public/get_tradingview_chart_data",
            orderbook: "/public/get_order_book",
            fundingRate: "/public/get_funding_rate_history"
        }
    },
    // sisanya analytics-capable (data cukup)
    DELTA: { baseUrlFuture: "https://api.delta.exchange", endpoints: { symbols: "/v2/products" } },
}


