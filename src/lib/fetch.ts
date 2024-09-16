import { Cover, Game } from '@/lib/types'
import api from '@/lib/api/api'

const UNLIMITED = 500

const modelImageUrl = (url: string, type: string) =>
    `https:${url.replace('t_thumb', `t_${type}`)}`

export const withCovers = async (games: Game[]) => {
    const coverIds: number[] = []
    for (let game of games) {
        if (game.cover) coverIds.push(game.cover)
    }
    const idsString = coverIds.join(',')
    console.log(idsString)
    const result = await api()
        .fields('*')
        .where(`id = (${idsString})`)
        .limit(UNLIMITED)
        .get('covers')
    const gameCovers: {
        [key: number]: string
    } = {}
    result.forEach((r: Cover) => {
        gameCovers[r.game] = r.url ? modelImageUrl(r.url, 'cover_big_2x') : ''
    })
    
    for (let index = 0; index < games.length; index++) {
        const game = games[index]
        game.coverUrl = gameCovers[game.id]
    }

    return games
}
