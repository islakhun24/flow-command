import { StructureEvent } from "./structure";

export type OrderBlockType = "BUY" | "SELL";

export interface OrderBlock {
    type: OrderBlockType;
    high: number;
    low: number;
    index: number;
}

export function detectOrderBlocks(
    candles: any[],
    structures: StructureEvent[]
): OrderBlock[] {
    const obs: OrderBlock[] = [];

    for (const s of structures) {
        if (s.type !== "BOS") continue;

        // Candle sebelum impuls
        const baseIndex = s.index - 1;
        if (baseIndex < 0) continue;

        const base = candles[baseIndex];

        obs.push({
            type: s.direction === "BULLISH" ? "BUY" : "SELL",
            high: base.high,
            low: base.low,
            index: baseIndex
        });
    }

    return obs;
}
