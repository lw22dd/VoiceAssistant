type Result<T> = {
    code: number
    msg: string
    data?: T
}
type PagingResult<T> = {
    items: T[]
    totalCount: number
}

export type { Result, PagingResult }