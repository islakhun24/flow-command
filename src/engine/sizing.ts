export function computePositionSize(
    balance: number,
    riskPercent: number,
    entry: number
) {
    return (balance * riskPercent) / entry
}
