export interface ExitContext {
    price: number

    sweepUp: boolean
    sweepDown: boolean

    oiDelta: number
    lsRetail: number
    divergence: number

    btcValid: boolean
}
