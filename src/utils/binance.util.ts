import {OIRawItem} from "../types/oi.type";
import {KlineBinanceResponse} from "../types/binance.type";

export function oiConverterBinanceToGlobal(data: any[]): OIRawItem[] {
    return (data || []).map(item => ({
        timestamp: item?.timestamp,
        openInterest: item?.sumOpenInterestValue
    })) as OIRawItem[];
}



export const parseKlineBinance = (k: any[]): KlineBinanceResponse => ({
    openTime: k[0],
    open: Number(k[1]),
    high: Number(k[2]),
    low: Number(k[3]),
    close: Number(k[4]),
    volume: Number(k[5]),
    closeTime: k[6],
    quoteVolume: Number(k[7]),
    tradeCount: k[8],
    takerBuyBaseVolume: Number(k[9]),
    takerBuyQuoteVolume: Number(k[10]),
    ignore: k[11],
});

