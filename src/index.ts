import { loadEnv } from "./config/env"

loadEnv()
import { connectMongo } from "./db/mongo"

async function bootstrap() {
    await connectMongo()
    // nanti: start server & scheduler
}

bootstrap()

import { startServer } from "./api/server"
import {getMarketFundingRates} from "./market/market";
startServer()
