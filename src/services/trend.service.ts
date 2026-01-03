import {runSMC} from "../engine/smc.engine";
import {getBinanceFutureKlineWithMapping} from "../market/binance.market";
import {classifyMcap} from "../utils/mcap.util";
import {getMarketCapUsd} from "../market/coingecko.client";
import {TF_FACTOR} from "../config/fvg.config";
import {passBiasGate} from "../indicators/bias/bias.gate";

export async function getSMCService(symbol: string) {
    const candles4h = await getBinanceFutureKlineWithMapping({symbol, period: "4h", limit: 500});
    const candles15m = await getBinanceFutureKlineWithMapping({symbol, period: "15m", limit: 500});
    const candles5m = await getBinanceFutureKlineWithMapping({symbol, period: "5m", limit: 500});

    const marketCapUsd = await getMarketCapUsd(symbol)
    const mcapClass = classifyMcap(marketCapUsd)
    const smc = runSMC(candles4h, mcapClass, TF_FACTOR["4h"]);

    const last = smc.structure.at(-1);

    const h4SMC = runSMC(candles4h, mcapClass, "H4");
    const m15SMC = runSMC(candles15m, mcapClass, "M15");
    const m5SMC = runSMC(candles5m, mcapClass, "M5");
    const biasAllowed = passBiasGate({
        h4: h4SMC.bias,
        m15: m15SMC.bias
    });

    if (!biasAllowed) {
        return {
            allowed: false,
            reason: "BIAS_GATE_BLOCK",
            bias: {
                h4: h4SMC.bias,
                m15: m15SMC.bias
            }
        };
    }
    if (!last) {
        return {
            symbol,
            timeframe: "H4",
            bias: "RANGE",
            tradePermission: { allowed: false }
        };

    }


    return {
        allowed: true,
        timeframes: {
            H4: {
                role: "TREND",
                bias: h4SMC.bias,
                structure: h4SMC.structure
            },
            M15: {
                role: "CONFIRMATION",
                bias: m15SMC.bias,
                structure: m15SMC.structure
            },
            M5: {
                role: "EXECUTION",
                fvgs: m5SMC.fvgs,
                orderBlocks: m5SMC.orderBlocks
            }
        }
    };
}
