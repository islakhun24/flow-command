import WebSocket from "ws"
import {API_CONSTANTS} from "../../config/api.constant";
import {HyperliquidWSOptions} from "../../types/hyperliquid.types";


const hyperliquidWSURL = API_CONSTANTS.HYPERLIQUID.wsUrl
export class HyperliquidWS {
    private ws?: WebSocket
    private readonly url = hyperliquidWSURL

    constructor(private opt: HyperliquidWSOptions) {}

    connect() {
        this.ws = new WebSocket(this.url)

        this.ws.on("open", () => {
            this.subscribe()
        })

        this.ws.on("message", msg => {
            try {
                const data = JSON.parse(msg.toString())
                this.opt.onMessage(data)
            } catch (e) {
                console.error("WS parse error", e)
            }
        })

        this.ws.on("close", () => {
            console.warn("Hyperliquid WS closed, reconnecting...")
            setTimeout(() => this.connect(), 2000)
        })
    }

    private subscribe() {
        if (!this.ws) return

        for (const channel of this.opt.channels) {
            this.ws.send(
                JSON.stringify({
                    method: "subscribe",
                    subscription: {
                        type: channel,
                        coin: this.opt.symbol
                    }
                })
            )
        }
    }

    close() {
        this.ws?.close()
    }
}

// CARA PAKAI
// const hl = new HyperliquidWS({
//     symbol: "BTC",
//     channels: ["trades", "l2Book", "funding", "openInterest"],
//     onMessage: data => {
//         console.log("HL:", data)
//     }
// })
//
// hl.connect()
