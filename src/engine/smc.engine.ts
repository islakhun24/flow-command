import {detectSwings} from "../indicators/smc/swing";
import {detectStructure} from "../indicators/smc/structure";
import {detectOrderBlocks} from "../indicators/smc/orderblock";
import {detectFVG} from "../indicators/smc/fvg";
import {calcATR} from "../indicators/smc/atr";
import {MCAP_FACTOR, TF_FACTOR} from "../config/fvg.config";
import {detectBias} from "../indicators/bias/bias.detector";


export function runSMC(candles: any[], mcapClass: keyof typeof  MCAP_FACTOR, tf: keyof typeof TF_FACTOR) {
    const currentPrice = candles[candles.length - 1].close

    const swings = detectSwings(candles);
    const structure = detectStructure(swings);
    console.log(structure)
    const orderBlocks = detectOrderBlocks(candles, structure);
    const atr = calcATR(candles)
    const bias = detectBias(structure);
    const fvgs = detectFVG(
        candles,
        atr,
        tf,
        mcapClass,
        currentPrice
    )

    return { swings, structure, orderBlocks, fvgs, bias };
}
