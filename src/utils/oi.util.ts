import {OIPerExchange, OIRawItem, OIRawSource} from "../types/oi.type";

export function buildOIRawSource(exchange: string, apiData: unknown): OIRawSource | null {
    if (!Array.isArray(apiData)) return null

    return {
        exchange: exchange,
        enabled: apiData.length > 0,
        data: apiData.map(d => ({
            timestamp: d?.timestamp ?? d?.time ?? null,
            openInterest: d?.openInterest != null
                ? Number(d.openInterest)
                : null,
        }))
    }
}
