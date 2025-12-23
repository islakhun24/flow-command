import axios from "axios"
import {API_CONSTANTS} from "../config/api.constant";
import {huobiContractCode, normalizeTimeframeHuobi} from "../utils/huobi.util";

const huobi = API_CONSTANTS.HUOBI

const httpHuobiFutures = axios.create({
    baseURL: huobi.baseUrlFuture,
    timeout: 10_000
})

async function getHuobiFuturesData<T>(
    url: string | undefined,
    params?: Record<string, any>
): Promise<T> {
    const res = await httpHuobiFutures.get<T>(url!, { params })
    return res.data
}

export async function getHuobiFutureTicker(params: { symbol: string }) {
    return getHuobiFuturesData<any>(huobi.endpoints.ticker, {
        contract_code: params.symbol
    })
}


export async function getHuobiFutureKlines(params: {
    symbol: string
    period?: string
    size?: number
}) {
    return getHuobiFuturesData<any>(huobi.endpoints.klines, {
        contract_code: params.symbol,
        period: params.period ?? "1min",
        size: params.size ?? 200
    })
}


export async function getHuobiFutureOrderbook(params: {
    symbol: string
    depth?: number
}) {
    return getHuobiFuturesData<any>(huobi.endpoints.orderbook, {
        contract_code: params.symbol,
        type: params.depth ? `step${params.depth}` : "step0"
    })
}

export async function getHuobiFutureOpenInterest(params: { symbol: string }) {
    return getHuobiFuturesData<any>(huobi.endpoints.openInterest, {
        contract_code: params.symbol
    })
}

export async function getHuobiFutureFundingRate(params: { symbol: string }) {
    const {data} = await getHuobiFuturesData<any>(huobi.endpoints.fundingRate, {
        contract_code: huobiContractCode(params.symbol)
    })

    return data
}

export async function getHuobiFutureSymbols() {
    return getHuobiFuturesData<any>(huobi.endpoints.symbols)
}

export async function getHuobiFutureTopTraderAccount(params: { symbol: string | undefined; period: string | undefined }) {
    const {data} = await getHuobiFuturesData<any>(huobi.endpoints.longShortTopAccount, {
        contract_code: huobiContractCode(params.symbol),
        period: normalizeTimeframeHuobi(params.period),
    })
    return data.list
}export async function getHuobiFutureTopTraderPosition(params: {
    symbol: string | undefined;
    period: string | undefined
}) {
    const {data} = await getHuobiFuturesData<any>(huobi.endpoints.longShortTopPosition, {
        contract_code: huobiContractCode(params.symbol),
        period: normalizeTimeframeHuobi(params.period),
    })

    return data.list
}
