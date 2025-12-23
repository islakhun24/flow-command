import axios from "axios"
import {API_CONSTANTS} from "../config/api.constant";

const hyperliquid = API_CONSTANTS.HYPERLIQUID

const hyperliquidClient = axios.create({
    baseURL: hyperliquid.baseUrlFuture,
    timeout: 10000
})

async function hyperliquidInfo<T>(payload: any): Promise<T> {
    const { data } = await hyperliquidClient.post("/info", payload)
    return data
}

export async function getHyperliquidSymbols() {
    return hyperliquidInfo({
        type: "meta"
    })
}

export async function getHyperliquidSymbols() {
    return hyperliquidInfo({
        type: "meta"
    })
}

export async function getHyperliquidTrades(symbol: string) {
    return hyperliquidInfo({
        type: "trades",
        coin: symbol
    })
}

export async function getHyperliquidTrades(symbol: string) {
    return hyperliquidInfo({
        type: "trades",
        coin: symbol
    })
}

export async function getHyperliquidFunding(symbol: string) {
    return hyperliquidInfo({
        type: "funding",
        coin: symbol
    })
}

