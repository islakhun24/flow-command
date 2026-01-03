export function passBiasGate( h4, m15): boolean {
    if (h4 === "NEUTRAL") return false;

    // H4 arah utama, M15 boleh retrace
    if (h4 === "LONG" && m15 === "SHORT") return true;
    if (h4 === "SHORT" && m15 === "LONG") return true;

    // Sejalan juga boleh
    if (h4 === m15) return true;

    return false;
}
