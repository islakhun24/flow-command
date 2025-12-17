export interface OIResult {
    delta: number
    direction: "IN" | "OUT" | "FLAT"
}

export function calcOIDelta(
    current: number,
    previous: number
): OIResult {
    const delta = current - previous

    let direction: OIResult["direction"] = "FLAT"
    if (delta > 0) direction = "IN"
    if (delta < 0) direction = "OUT"

    return { delta, direction }
}
