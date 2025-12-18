export type Trend = "UP" | "DOWN" | "FLAT"

export function calcCVDTrend(trades: any[]): Trend {
    let delta = 0
    for (const t of trades) {
        delta += t.isBuyerMaker ? -Number(t.qty) : Number(t.qty)
    }
    return delta > 0 ? "UP" : delta < 0 ? "DOWN" : "FLAT"
}
