export type LSSourceKey = "global" | "topPosition" | "topAccount"

export interface LSSource {
    enabled: boolean
    raw: number | null
    normalized: number | null
}

export interface LSFinal {
    score: number
    state: "SHORT_DOMINANT" | "BALANCED" | "LONG_DOMINANT"
    bias: "SHORT_CROWDED" | "NEUTRAL" | "LONG_CROWDED"
}
