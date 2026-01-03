export function calcFVGScore(
    size: number,
    minSize: number,
    fill: number,
    mcapClass: string
) {
    let score = 0

    if (size >= minSize) score += 40
    if (fill <= 30) score += 30
    else if (fill <= 50) score += 20

    if (mcapClass === "LARGE") score += 10

    return score
}
