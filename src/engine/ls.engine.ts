// src/common/ls/ls.builder.ts


import {LSRawItem, LSRawSource, LSType} from "../types/ls.type";

export function buildLSRawSource(
    type: LSType,
    apiData?: any[]
): LSRawSource {
    return <LSRawSource>{
        enabled: Array.isArray(apiData) && apiData.length > 0,
        type,
        data: Array.isArray(apiData)
            ? apiData.map<LSRawItem>(d => ({
                timestamp: d.timestamp ?? d.time ?? null,
                longAccount: d.longAccount != null ? Number(d.longAccount) : null,
                shortAccount: d.shortAccount != null ? Number(d.shortAccount) : null,
                longShortRatio: d.longShortRatio != null ? Number(d.longShortRatio) : null,
                longPosition: d.longPosition != null ? Number(d.longPosition) : null,
                shortPosition: d.shortPosition != null ? Number(d.shortPosition) : null
            }))
            : []
    }
}

