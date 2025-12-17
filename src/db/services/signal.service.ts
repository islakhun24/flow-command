import {SignalModel, SignalStatus} from "../models/Signal"
import { sendSignalUpdate } from "../../alert/update.alert"
import {SignalResult} from "../../types/signal.types";

export async function saveSignal(signal: SignalResult) {
    return SignalModel.create({
        symbol: signal.symbol,
        bias: signal.bias,
        confidence: signal.confidence,
        timeframe: signal.timeframe,
        btcValid: signal.btcValid,
        entry: signal.entryZone?.low,
        stopLoss: signal.stopLoss,
        takeProfit: signal.takeProfit,
        reasons: signal.reasons
    })
}

export async function updateSignalStatus(
    signalId: string,
    status: SignalStatus,
    note?: string
) {
    const updated = await SignalModel.findByIdAndUpdate(
        signalId,
        { status },
        { new: true }
    )

    if (!updated) return

    await sendSignalUpdate(updated.symbol, status, note)
}
