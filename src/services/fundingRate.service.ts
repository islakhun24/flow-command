import {getFundingRate} from "../market/binance.client";
import {getMarketFundingRates} from "../market/market";

export async function fundingRateService(symbol: string) {
    const fundingRates = await getMarketFundingRates(symbol);
    return fundingRates;
}
