import e, {Request, Response} from "express";
import {findLastUnfilledFVGWithGap} from "../engine/fvg.engine";
import {runWithLimit} from "../utils/concurrency";
import {rankByLS} from "../engine/pairInformation.engine";
import {getAllFuturesSymbols} from "../market/binance.client";

export async function PairInformationController(
    _req: Request,
    res: Response) {
    try {
        const queryParams = String(_req.query.symbols || "")
            .split(",")
            .map(s => s.trim())
            .filter(Boolean)

        const options = {
            useGlobalLS: _req.query.useGlobalLS === "true",
            useTopPositionLS: _req.query.useTopPositionLS === "true",
            useTopAccountLS: _req.query.useTopAccountLS === "true"
        }


        // if (!options.useGlobalLS && !options.useTopPositionLS && !options.useTopAccountLS) {
        //     return res.status(400).json({
        //         error: "Minimal satu LS harus diaktifkan"
        //     })
        // }

        const sort =
            _req.query.sort === "asc" ? "desc" : "asc"
        const symbols = await getAllFuturesSymbols()
        const data = await rankByLS(symbols, {
            useTopPositionLS: true,
            useTopAccountLS: true,
            useGlobalLS: true,
            sort: sort
        })

        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({
            error: err.message || "Internal error"
        })
    }
}
