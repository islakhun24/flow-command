import {McapClass} from "../types/mcap.type";

export function classifyMcap(marketCap: number): McapClass {
    if (marketCap >= 10_000_000_000) return "LARGE"
    if (marketCap >= 1_000_000_000) return "MID"
    if (marketCap >= 200_000_000) return "LOW"
    return "MICRO"
}
