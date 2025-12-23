import WebSocket from "ws"

export abstract class BaseWebSocket {
    protected ws?: WebSocket
    protected reconnectInterval = 3000

    constructor(protected readonly url: string | undefined) {}

    connect(onOpen?: () => void) {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
            onOpen?.()
        }

        this.ws.onclose = () => {
            setTimeout(() => this.connect(onOpen), this.reconnectInterval)
        }

        this.ws.onerror = () => {
            this.ws?.close()
        }
    }

    protected send(payload: any) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(payload))
        }
    }

    protected onMessage(cb: (msg: any) => void) {
        this.ws!.onmessage = e => {
            cb(JSON.parse(e.data))
        }
    }
}
