import {Request, Response} from "express";
import {prePumpScan} from "../services/prePump.service";

export async function prePumpScanController(
    _req: Request,
    res: Response
) {
    const data = await prePumpScan()
    res.json(data)
}
