import { Bias } from "./bias.types";

export function detectBias(structure: any[]): Bias {
    if (structure.length < 2) return "NEUTRAL";

    const recent = structure.slice(-5); // lihat 5 event terakhir
    const bos = recent.filter(s => s.type === "BOS");

    if (bos.length === 0) return "NEUTRAL";

    const bullish = bos.filter(b => b.direction === "BULLISH").length;
    const bearish = bos.filter(b => b.direction === "BEARISH").length;

    if (bullish > bearish) return "LONG";
    if (bearish > bullish) return "SHORT";

    return "NEUTRAL";
}
