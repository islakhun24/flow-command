import {SignalResult} from "../types/signal.types";

export function formatBTCAlert(signal: SignalResult): string {
    return `
🟠 *BTC VALID*

⏱ TF: ${signal.timeframe}
📊 Confidence: ${signal.confidence}%

📌 Reason:
${signal.reasons.slice(0, 4).map(r => `- ${r}`).join("\n")}

⏳ Status: VALID
`
}

export function formatAltAlert(signal: SignalResult): string {
    return `
⚡ *${signal.bias} SIGNAL* — ${signal.symbol}

⏱ TF: ${signal.timeframe}
📊 Confidence: ${signal.confidence}%

📌 BTC Status: ${signal.btcValid ? "VALID" : "INVALID"}

📌 Reason:
${signal.reasons.slice(0, 5).map(r => `- ${r}`).join("\n")}

⚠️ *Trade sesuai plan, bukan emosi*
`
}

export function formatUpdateAlert(
    symbol: string,
    result: "WIN" | "LOSE" | "EXPIRED",
    note?: string
): string {
    return `
🔄 *SIGNAL UPDATE*

Symbol: ${symbol}
Status: ${result}
${note ? `Note: ${note}` : ""}

⏱ Update otomatis
`
}

export function formatExitAlert(symbol: string, reason: string): string {
    return `
🚨 *EXIT ALERT*

Symbol: ${symbol}
Reason: ${reason}

⛔ Posisi ditutup / dibatalkan
`
}
