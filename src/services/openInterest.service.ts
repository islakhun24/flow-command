import {getMarketFundingRates, getOpenInterestRates} from "../market/market";

export async function openInterestService(symbol: string, interval: string) {
    const openInterest = await getOpenInterestRates(symbol, interval);
    return openInterest;
}
