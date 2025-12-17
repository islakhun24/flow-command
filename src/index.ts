import { loadEnv } from "./config/env"

loadEnv()
import { connectMongo } from "./db/mongo"

async function bootstrap() {
    await connectMongo()
    // nanti: start server & scheduler
}

bootstrap()

import { startServer } from "./api/server"
import {runBacktest} from "./engine/backtest.engine";
import {getHistoricalSnapshots} from "./market/market.service";
startServer()

async function runningBT() {
    const snapshot = await getHistoricalSnapshots('BTCUSDT')
    console.log(snapshot)
    const backtest = await runBacktest('BTCUSDT', snapshot)
    console.log(backtest)
}
runningBT()
