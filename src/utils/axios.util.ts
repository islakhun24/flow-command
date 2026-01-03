import { AxiosError } from "axios"

export function logAxiosError(
    err: unknown,
    url?: string,
    params?: any
) {
    if (!(err instanceof AxiosError)) {
        console.error("❌ Unknown Error", err)
        return
    }

    const status = err.response?.status
    const data = err.response?.data

    console.error("🚨 Binance API Error")
    console.error("URL:", url)
    console.error("Params:", params)
    console.error("Status:", status)
    console.error("Message:", err.message)

    if (data) {
        console.error("Response:", JSON.stringify(data))
    }

    // Rate limit / ban handling
    if (status === 418 || status === 429) {
        console.error("⛔ RATE LIMIT / IP BAN — slowdown required")
    }

    // Timeout
    if (err.code === "ECONNABORTED") {
        console.error("⌛ REQUEST TIMEOUT")
    }
}
