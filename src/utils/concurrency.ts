export async function runWithLimit<T>(
    items: T[],
    limit: number,
    task: (item: T) => Promise<void>
) {
    let index = 0

    async function worker() {
        while (index < items.length) {
            const current = items[index++]
            await task(current)
        }
    }

    const workers = Array.from(
        { length: limit },
        () => worker()
    )

    await Promise.all(workers)
}
