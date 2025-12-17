import { BTC } from "../config/btc"

let lastBTCValidAt = 0

export async function checkBTCValidity(): Promise<boolean> {
    // placeholder: nanti isi LS + OI BTC logic
    const btcValidNow = true

    if (btcValidNow) {
        lastBTCValidAt = Date.now()
        return true
    }

    return Date.now() - lastBTCValidAt < BTC.VALID_WINDOW_MS
}
