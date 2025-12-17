import { sendTelegram } from "./alert.service"
import { formatExitAlert } from "./formatter"

export async function sendExitAlert(symbol: string, reason: string) {
    await sendTelegram(formatExitAlert(symbol, reason))
}
