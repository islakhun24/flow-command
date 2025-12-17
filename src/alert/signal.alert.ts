import { sendTelegram } from "./alert.service"
import { formatBTCAlert, formatAltAlert } from "./formatter"
import {SignalResult} from "../types/signal.types";

export async function sendSignalAlert(signal: SignalResult) {
    // BTC MASTER
    if (signal.symbol === "BTCUSDT" && signal.btcValid) {
        await sendTelegram(formatBTCAlert(signal))
        return
    }

    // ALT FOLLOWER
    if (signal.symbol !== "BTCUSDT") {
        if (!signal.btcValid) return
        if (signal.bias === "NEUTRAL") return
        if (signal.confidence < 70) return

        await sendTelegram(formatAltAlert(signal))
    }
}
