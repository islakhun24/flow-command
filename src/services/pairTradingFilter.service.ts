import {getAllFuturesSymbols, getAllPerpetualSymbols} from "../market/binance.client";
import {runWithLimit} from "../utils/concurrency";
import {getCoinDetail, getCoinList, getMarketCapUsd, getMultipleCoin} from "../market/coingecko.client";

export async function PairTradingFilterService() {
    console.log("SERVICE START"); // ← HARUS MUNCUL

    const coinMap: Record<string, string> = {};

    const symbolData = await getAllFuturesSymbols();

    const coinsList = await getCoinList();
    coinsList.forEach((c: any) => {
        coinMap[c.symbol] = c.id;
    });

    const batchSize = 200;
    const result: any[] = [];

    for (let i = 0; i < symbolData.length; i += batchSize) {

        const batchSymbols = symbolData.slice(i, i + batchSize);
        const batchIds = batchSymbols
            .map(s => coinMap[s.replace(/USDT$/, "").toLowerCase()])
            .filter(Boolean);

        if (!batchIds.length) continue;

        const data = await getMultipleCoin(batchIds.join(",")); // FIXED
        result.push(...data);
    }
    return result;
}
