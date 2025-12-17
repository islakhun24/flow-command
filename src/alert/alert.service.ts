import axios from "axios"

const TELEGRAM_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`

export async function sendTelegram(message: string) {
    if (!process.env.TELEGRAM_TOKEN || !process.env.TELEGRAM_CHAT_ID) return

    await axios.post(TELEGRAM_URL, {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown"
    })
}
