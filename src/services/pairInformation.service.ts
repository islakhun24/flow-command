import {getAllFuturesSymbols, getKlines} from "../market/binance.client";
import {findLastUnfilledFVGWithGap} from "../engine/fvg.engine";
import {LSOptions} from "../types/longShortRatio.types";
import {SortOrder} from "../types/common.type";

export async function pairInformationService(
    opt: LSOptions,
    sort: SortOrder = "asc"
){
    const symbols = (await getAllFuturesSymbols())
    const candles = await getKlines()
    const fvg = findLastUnfilledFVGWithGap(candles, {
        minGapPercent: 0.25
    })
}
