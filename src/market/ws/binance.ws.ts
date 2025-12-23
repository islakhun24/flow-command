import WebSocket from "ws"
import {API_CONSTANTS} from "../../config/api.constant";
const binanceWsURL = API_CONSTANTS.BINANCE.wsUrl

export interface BinanceWSOptions {
    symbol: string
    streams: string[]
    onMessage: (data: any) => void
}

export class BinanceWS {
    private ws?: WebSocket

    constructor(private opt: BinanceWSOptions) {}

    connect() {
        const stream = this.opt.streams.join("/")
        const url = `${binanceWsURL}?streams=${stream}`

        this.ws = new WebSocket(url)

        this.ws.on("message", msg => {
            this.opt.onMessage(JSON.parse(msg.toString()))
        })

        this.ws.on("close", () => {
            console.warn("Binance WS closed, reconnecting...")
            setTimeout(() => this.connect(), 1000)
        })
    }

    close() {
        this.ws?.close()
    }
}
