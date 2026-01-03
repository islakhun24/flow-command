import WebSocket from "ws"
import { API_CONSTANTS } from "../../config/api.constant"

const BASE_WS_URL = API_CONSTANTS.BINANCE.wsUrl

export interface BinanceWSOptions {
    symbol: string
    streams: string[]          // ["aggTrade", "depth20@100ms"]
    onMessage: (data: any, stream: string) => void
    reconnectInterval?: number
}

export class BinanceWS {
    private ws?: WebSocket
    private reconnecting = false

    constructor(private opt: BinanceWSOptions) {}

    connect() {
        if (this.ws) return

        const symbol = this.opt.symbol.toLowerCase()

        const streamPath = this.opt.streams
            .map(s => `${symbol}@${s}`)
            .join("/")

        const url = `${BASE_WS_URL}/stream?streams=${streamPath}`

        this.ws = new WebSocket(url)

        this.ws.on("open", () => {
            console.log("✅ Binance WS connected:", streamPath)
            this.reconnecting = false
        })

        this.ws.on("message", msg => {
            const parsed = JSON.parse(msg.toString())

            // multi-stream format
            if (parsed.stream && parsed.data) {
                this.opt.onMessage(parsed.data, parsed.stream)
            } else {
                this.opt.onMessage(parsed, "single")
            }
        })

        this.ws.on("error", err => {
            console.error("❌ Binance WS error", err)
        })

        this.ws.on("close", () => {
            console.warn("⚠️ Binance WS closed")
            this.ws = undefined
            this.reconnect()
        })
    }

    private reconnect() {
        if (this.reconnecting) return
        this.reconnecting = true

        setTimeout(() => {
            console.log("♻️ Reconnecting Binance WS...")
            this.connect()
        }, this.opt.reconnectInterval ?? 1500)
    }

    close() {
        this.ws?.close()
        this.ws = undefined
    }
}
