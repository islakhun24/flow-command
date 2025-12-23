import { LSPerExchange, LSType, LSRawSource } from "../types/ls.type"

export function LSemptyGenerator(
    exchange: string,
    types: LSType[] = ["GLOBAL", "TOP_ACCOUNT", "TOP_POSITION"]
): LSPerExchange {

    const result: LSPerExchange = { exchange }

    if (types.includes("GLOBAL")) {
        result.global = {
            enabled: false,
            type: "GLOBAL",
            data: []
        }
    }

    if (types.includes("TOP_ACCOUNT")) {
        result.topAccount = {
            enabled: false,
            type: "TOP_ACCOUNT",
            data: []
        }
    }

    if (types.includes("TOP_POSITION")) {
        result.topPosition = {
            enabled: false,
            type: "TOP_POSITION",
            data: []
        }
    }

    return result
}
