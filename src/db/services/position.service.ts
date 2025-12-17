import { PositionModel } from "../models/Position"

export async function openPosition(data: {
    symbol: string
    side: string
    entry: number
    size: number
}) {
    return PositionModel.create(data)
}

export async function closePosition(
    symbol: string,
    pnl: number,
    reason: string
) {
    return PositionModel.findOneAndUpdate(
        { symbol, status: "OPEN" },
        {
            status: "CLOSED",
            pnl,
            closeReason: reason
        }
    )
}
import { PositionModel } from "../models/Position"

export async function openPosition(data: {
    symbol: string
    side: string
    entry: number
    size: number
}) {
    return PositionModel.create(data)
}

export async function closePosition(
    symbol: string,
    pnl: number,
    reason: string
) {
    return PositionModel.findOneAndUpdate(
        { symbol, status: "OPEN" },
        {
            status: "CLOSED",
            pnl,
            closeReason: reason
        }
    )
}
