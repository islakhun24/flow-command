import { updateBTCContext } from "./btc.worker"
import { scanAltSymbol } from "./alt.worker"
import {getAllPerpetualSymbols} from "../market/binance.client";

const SCAN_INTERVAL = 30000 // 30 detik

export async function startScanner() {
    console.log("🚀 Scanner started")

    const symbols = await getAllPerpetualSymbols()

    setInterval(async () => {
        try {
            // 1️⃣ BTC FIRST
            const btcCtx = await updateBTCContext()
            console.log(btcCtx)
            if (!btcCtx) return

            // 2️⃣ SCAN ALT
            for (const symbol of symbols) {
                if (symbol === "BTCUSDT") continue
                await scanAltSymbol(symbol, btcCtx)
            }

            // 3️⃣ EXIT CHECK
            // await monitorOpenPositions()

        } catch (err) {
            console.error("Scanner error:", err)
        }
    }, SCAN_INTERVAL)
}
