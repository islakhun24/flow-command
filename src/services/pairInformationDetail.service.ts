import {getAllFuturesSymbols, getKlines} from "../market/binance.client";
import {findLastUnfilledFVGWithGap} from "../engine/fvg.engine";

export async function pairInformationService(
    symbol: string,
    period: string
){
    const symbols = (await getAllFuturesSymbols())
    const candles = await getKlines(symbol, period, 1000);
    const fvg = findLastUnfilledFVGWithGap(candles, {
        minGapPercent: 0.25
    })
}
