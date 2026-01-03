import { SwingPoint } from "./swing";

export type StructureType = "BOS" | "CHOCH";
export type StructureDirection = "BULLISH" | "BEARISH";

export interface StructureEvent {
    type: StructureType;
    direction: StructureDirection;
    level: number;
    index: number;
}

export function detectStructure(
    swings: SwingPoint[]
): StructureEvent[] {
    const events: StructureEvent[] = [];

    for (let i = 2; i < swings.length; i++) {
        const a = swings[i - 2];
        const b = swings[i - 1];
        const c = swings[i];

        // === BULLISH BOS ===
        if (
            a.type === "HIGH" &&
            b.type === "LOW" &&
            c.type === "HIGH" &&
            c.price > a.price
        ) {
            events.push({
                type: "BOS",
                direction: "BULLISH",
                level: a.price,
                index: c.index
            });
        }

        // === BEARISH BOS ===
        if (
            a.type === "LOW" &&
            b.type === "HIGH" &&
            c.type === "LOW" &&
            c.price < a.price
        ) {
            events.push({
                type: "BOS",
                direction: "BEARISH",
                level: a.price,
                index: c.index
            });
        }

        // === CHOCH → early reversal ===
        if (
            a.type === "HIGH" &&
            b.type === "LOW" &&
            c.type === "HIGH" &&
            c.price < a.price
        ) {
            events.push({
                type: "CHOCH",
                direction: "BEARISH",
                level: b.price,
                index: c.index
            });
        }

        if (
            a.type === "LOW" &&
            b.type === "HIGH" &&
            c.type === "LOW" &&
            c.price > a.price
        ) {
            events.push({
                type: "CHOCH",
                direction: "BULLISH",
                level: b.price,
                index: c.index
            });
        }
    }

    return events;
}
import { SwingPoint } from "./swing";

export type StructureType = "BOS" | "CHOCH";
export type StructureDirection = "BULLISH" | "BEARISH";

export interface StructureEvent {
    type: StructureType;
    direction: StructureDirection;
    level: number;
    index: number;
}

export function detectStructure(
    swings: SwingPoint[]
): StructureEvent[] {
    const events: StructureEvent[] = [];

    for (let i = 2; i < swings.length; i++) {
        const a = swings[i - 2];
        const b = swings[i - 1];
        const c = swings[i];

        // === BULLISH BOS ===
        if (
            a.type === "HIGH" &&
            b.type === "LOW" &&
            c.type === "HIGH" &&
            c.price > a.price
        ) {
            events.push({
                type: "BOS",
                direction: "BULLISH",
                level: a.price,
                index: c.index
            });
        }

        // === BEARISH BOS ===
        if (
            a.type === "LOW" &&
            b.type === "HIGH" &&
            c.type === "LOW" &&
            c.price < a.price
        ) {
            events.push({
                type: "BOS",
                direction: "BEARISH",
                level: a.price,
                index: c.index
            });
        }

        // === CHOCH → early reversal ===
        if (
            a.type === "HIGH" &&
            b.type === "LOW" &&
            c.type === "HIGH" &&
            c.price < a.price
        ) {
            events.push({
                type: "CHOCH",
                direction: "BEARISH",
                level: b.price,
                index: c.index
            });
        }

        if (
            a.type === "LOW" &&
            b.type === "HIGH" &&
            c.type === "LOW" &&
            c.price > a.price
        ) {
            events.push({
                type: "CHOCH",
                direction: "BULLISH",
                level: b.price,
                index: c.index
            });
        }
    }

    return events;
}
