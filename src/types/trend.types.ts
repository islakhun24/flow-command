// ===== COMMON =====
export type Bias = "BULLISH" | "BEARISH" | "RANGE";
export type SetupStatus = "NO_TRADE" | "WAIT" | "READY";

// ===== H4 =====
export interface H4TrendResponse {
    symbol: string;
    timeframe: "H4";
    bias: Bias;
    structure?: {
        type: "BOS" | "CHOCH";
        direction: Bias;
        level: number;
    };
    tradePermission: {
        allowed: boolean;
        reason?: string;
    };
}

// ===== M15 =====
export interface M15TrendResponse {
    symbol: string;
    timeframe: "M15";
    htfBias: Bias;
    setupStatus: SetupStatus;
    orderBlock?: {
        high: number;
        low: number;
        type: "BUY" | "SELL";
    };
    fvg?: {
        high: number;
        low: number;
        direction: "BULLISH" | "BEARISH";
    };
}

// ===== M5 =====
export interface M5TrendResponse {
    symbol: string;
    timeframe: "M5";
    entrySignal: {
        ready: boolean;
        type?: "LONG" | "SHORT";
    };
    execution: {
        allowed: boolean;
        confidence: "LOW" | "MEDIUM" | "HIGH";
    };
}
