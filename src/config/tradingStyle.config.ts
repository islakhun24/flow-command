import {TradingConfig, TradingStyle} from "../types/trading-style.type";

export const SCALPING_CONFIG: TradingConfig = {
    funding: {
        timeframe: "1h",
        window: 30,
        role: "FILTER"
    },
    lsRatio: {
        timeframe: "1h",
        window: 30,
        role: "FILTER",
        extreme: {
            long: 1.6,
            short: 0.6,
            persistence: 3
        }
    },
    openInterest: {
        timeframe: "5m",
        window: 20,
        role: "CONFIRMATION"
    },
    volume: {
        timeframe: "1m",
        window: 50,
        useCVD: true
    },
    price: {
        timeframe: "1m",
        window: 100,
        structure: false,
        liquidity: true
    },
    volatility: {
        timeframe: "5m",
        atrWindow: 14
    },
    risk: {
        maxRiskPerTrade: 0.5,
        minRR: 1.5
    }
}

export const INTRADAY_CONFIG: TradingConfig = {
    funding: {
        timeframe: "8h",
        window: 100,
        role: "BIAS"
    },
    lsRatio: {
        timeframe: "1h",
        window: 50,
        role: "BIAS",
        extreme: {
            long: 1.4,
            short: 0.7,
            persistence: 6
        }
    },
    openInterest: {
        timeframe: "15m",
        window: 50,
        role: "CONFIRMATION"
    },
    volume: {
        timeframe: "15m",
        window: 100,
        useCVD: true
    },
    price: {
        timeframe: "15m",
        window: 100,
        structure: true,
        liquidity: true
    },
    volatility: {
        timeframe: "15m",
        atrWindow: 14
    },
    risk: {
        maxRiskPerTrade: 1,
        minRR: 2
    }
}

export const SWING_CONFIG: TradingConfig = {
    funding: {
        timeframe: "8h",
        window: 150,
        role: "BIAS"
    },
    lsRatio: {
        timeframe: "4h",
        window: 100,
        role: "BIAS",
        extreme: {
            long: 1.3,
            short: 0.75,
            persistence: 10
        }
    },
    openInterest: {
        timeframe: "4h",
        window: 100,
        role: "CONFIRMATION"
    },
    volume: {
        timeframe: "4h",
        window: 100,
        useCVD: false
    },
    price: {
        timeframe: "4h",
        window: 150,
        structure: true,
        liquidity: true
    },
    volatility: {
        timeframe: "4h",
        atrWindow: 14
    },
    risk: {
        maxRiskPerTrade: 1,
        minRR: 3
    }
}

export const POSITION_CONFIG: TradingConfig = {
    funding: {
        timeframe: "1d",
        window: 200,
        role: "BIAS"
    },
    lsRatio: {
        timeframe: "1d",
        window: 150,
        role: "FILTER",
        extreme: {
            long: 1.25,
            short: 0.8,
            persistence: 15
        }
    },
    openInterest: {
        timeframe: "1d",
        window: 150,
        role: "CONFIRMATION"
    },
    volume: {
        timeframe: "1d",
        window: 100,
        useCVD: false
    },
    price: {
        timeframe: "1d",
        window: 200,
        structure: true,
        liquidity: false
    },
    volatility: {
        timeframe: "1d",
        atrWindow: 20
    },
    risk: {
        maxRiskPerTrade: 1,
        minRR: 4
    }
}

export function getConfig(style: TradingStyle): TradingConfig {
    switch (style) {
        case "SCALPING": return SCALPING_CONFIG
        case "INTRADAY": return INTRADAY_CONFIG
        case "SWING": return SWING_CONFIG
        case "POSITION": return POSITION_CONFIG
    }
}
