import {RawLS} from "../types/pairInformation.type";

export function  classify(score: number): { state: string; bias: "LONG" | "SHORT" | "NEUTRAL" } {
    if (score > 1.2) return { state: "LONG_DOMINANT", bias: "LONG" }
    if (score < 0.8) return { state: "SHORT_DOMINANT", bias: "SHORT" }
    return { state: "BALANCED", bias: "NEUTRAL" }
}


export function confidence(score: number) {
    const val = Math.min(100, Math.abs(score) * 100)
    return {
        score: Math.round(val),
        level: val >= 70 ? "HIGH" : val >= 40 ? "MEDIUM" : "LOW"
    }
}

export function  normalize(raw: RawLS | null): number {
    if (!raw) return 0

    const ratio = Number(raw.longShortRatio)
    return Number.isFinite(ratio) ? ratio : 0
}



