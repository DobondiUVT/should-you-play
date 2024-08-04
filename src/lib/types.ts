export type Game = {
    // API
    id: number
    name: string
    cover?: number

    // Manual
    coverUrl: string
}

export type Cover = {
    id: number
    url: string
    game: number
}
