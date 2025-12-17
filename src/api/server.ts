import express from "express"
import { getMarketSnapshot } from "../market/market.service"
import { detectSweep } from "../indicators/sweep"
import { analyzeLongShort } from "../indicators/longShort"

export function startServer() {
    const app = express()
    const port = process.env.PORT || 3000

    app.use(express.json())

    app.get("/health", (_, res) => {
        res.json({ status: "ok" })
    })

    app.get("/debug/:symbol", async (req, res) => {
        const data = await getMarketSnapshot(req.params.symbol.toUpperCase())
        res.json(data)
    })


    app.listen(port, () => {
        console.log(`Flow-Command API running on port ${port}`)
    })
}
