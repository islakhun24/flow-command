import {LSSource} from "../types/longShortRatio.types";
import {generateRawLS, PairInformationQueryParams, PairInformationResponse, RawLS} from "../types/pairInformation.type";
import {classify, normalize} from "../utils/pairInformation.util";
import {getLSRetail, getLSTopTrader, getLSTopTraderAccount} from "../market/binance.client";

export async function rankByLS(
    symbols: string[],
    opt: PairInformationQueryParams
) {
    const results: PairInformationResponse[] = await Promise.all(
        symbols.map(s => buildLSResponse(s, opt))
    )
    results.sort((a, b) =>
        opt?.sort === "asc"
            ? a.pairInformation.ls.score - b.pairInformation.ls.score
            : b.pairInformation.ls.score - a.pairInformation.ls.score
    )

    return results.map((r, i) => ({
        ...r,
        rank: {
            position: i + 1,
            total: results.length
        }
    }))
}

 async function buildLSResponse(
    symbol: string,
    opt: PairInformationQueryParams
): Promise<PairInformationResponse> {
    if (!opt.useGlobalLS && !opt.useTopPositionLS && !opt.useTopAccountLS) {
        throw new Error("Minimal 1 LS harus dipilih")
    }

    const sources: Record<
        "global" | "topPosition" | "topAccount",
        {
            enabled: boolean
            raw: RawLS | null
            normalized: number | null
        }
    > = {
        global: { enabled: !!opt.useGlobalLS, raw: null, normalized: null },
        topPosition: { enabled: !!opt.useTopPositionLS, raw: null, normalized: null },
        topAccount: { enabled: !!opt.useTopAccountLS, raw: null, normalized: null }
    }

    const values: number[] = []

    /* ===============================
       GLOBAL LS
    ================================ */
    if (sources.global.enabled) {
        const raw = await getLSRetail(symbol)
        const item = raw?.[0] ?? null

        sources.global.raw = item
        sources.global.normalized = normalize(item)

        if (sources.global.normalized > 0) {
            values.push(sources.global.normalized)
        }
    }

    /* ===============================
       TOP POSITION LS
    ================================ */
    if (sources.topPosition.enabled) {
        const raw = await getLSTopTrader(symbol)
        const item = raw?.[0] ?? null

        sources.topPosition.raw = item
        sources.topPosition.normalized = normalize(item)

        if (sources.topPosition.normalized > 0) {
            values.push(sources.topPosition.normalized)
        }
    }

    /* ===============================
       TOP ACCOUNT LS
    ================================ */
    if (sources.topAccount.enabled) {
        const raw = await getLSTopTraderAccount(symbol)
        const item = raw?.[0] ?? null

        sources.topAccount.raw = item
        sources.topAccount.normalized = normalize(item)

        if (sources.topAccount.normalized > 0) {
            values.push(sources.topAccount.normalized)
        }
    }

    /* ===============================
       FINAL SCORE
    ================================ */
    const score =
        values.length > 0
            ? values.reduce((a, b) => a + b, 0) / values.length
            : 0

    const cls = classify(score)
    return {
        pairInformation: {
            symbol,
            ls: {
                lsGlobalAccount: {
                    enabled: sources.global.enabled,
                    raw: generateRawLS(sources.global.raw as RawLS),
                    normalized: sources.global.normalized
                },
                lsTopAccount: {
                    enabled: sources.topAccount.enabled,
                    raw: generateRawLS(sources.topAccount.raw as RawLS),
                    normalized: sources.topAccount.normalized
                },
                lsTopPosition: {
                    enabled: sources.topPosition.enabled,
                    raw: generateRawLS(sources.topPosition.raw as RawLS),
                    normalized: sources.topPosition.normalized
                },
                score: Number(score.toFixed(4)),
                state: cls.state,
                bias: cls.bias
            }
        }
    }

// return {
    //     symbol,
    //     ls: {
    //         sources: sources as any,
    //         final: {
    //             score: Number(score.toFixed(4)),
    //             state: cls.state,
    //             bias: cls.bias
    //         }
    //     },
    //     confidence: confidence(score)
    // }
}
