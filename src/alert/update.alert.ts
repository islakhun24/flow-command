import { sendTelegram } from "./alert.service"
import { formatUpdateAlert } from "./formatter"

export async function sendSignalUpdate(
    symbol: string,
    status: "WIN" | "LOSE" | "EXPIRED",
    note?: string
) {
    await sendTelegram(formatUpdateAlert(symbol, status, note))
}
