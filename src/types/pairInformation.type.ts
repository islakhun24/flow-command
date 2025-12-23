export interface PairInformationResponse {
    pairInformation: {
        symbol: string,
        ls: {
            score: number;
            lsTopPosition: { normalized: number | null; raw: RawLS | null; enabled: boolean };
            bias: "LONG" | "SHORT" | "NEUTRAL";
            lsGlobalAccount: { normalized: number | null; raw: RawLS | null; enabled: boolean };
            state: string;
            lsTopAccount: { normalized: number | null; raw: RawLS | null; enabled: boolean }
        }
    };
}

export interface PairInformationQueryParams {
    useGlobalLS: boolean
    useTopPositionLS: boolean
    useTopAccountLS: boolean
    sort?: 'asc' | 'desc'
}

export interface LSPairInformation {
    enabled: boolean,
    raw: RawLS,
    normalized: any
}

export interface RawLS {
    longAccount: number,
    shortAccount: number,
    longShortRatio: number,
    timestamp: number
}

export const generateRawLS = (s: RawLS) => ({
    longAccount: s.longAccount,
    shortAccount: s.shortAccount,
    longShortRatio: s.longShortRatio,
    timestamp: s.timestamp,
})

