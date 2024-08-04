import { Cover, Game } from '@/lib/types'

const BASE_URL = 'https://api.igdb.com/v4/'
const CLIENT_ID = process.env['API_CLIENT_ID']
const ACCESS_TOKEN = process.env['API_ACCESS_TOKEN']
const UNLIMITED = 500

interface ApiProps {
    fields?: string[] | '*'
    limit?: number
    where?: string[] | string
    exclude?: string[]
    sort?: {
        field: string
        type: 'asc' | 'desc'
    }
    search?: string
}

const getFetchBody = (props: ApiProps) => {
    const { fields, limit, where, exclude, sort, search } = props
    const bodyConstructor = []

    if (fields) {
        const fieldsString = fields === '*' ? '*' : fields.join(',')
        bodyConstructor.push(`fields ${fieldsString}`)
    }

    if (limit) {
        bodyConstructor.push(`limit ${limit}`)
    }

    if (where) {
        const whereString = Array.isArray(where) ? where.join(' & ') : where
        bodyConstructor.push(`where ${whereString}`)
    }

    if (exclude) {
        bodyConstructor.push(`exclude ${exclude}`)
    }

    if (sort) {
        bodyConstructor.push(`sort ${sort.field} ${sort.type}`)
    }

    if (search) {
        bodyConstructor.push(`search "${search}"`)
    }

    return bodyConstructor.join(';') + ';'
}

const modelImageUrl = (url: string, type: string) =>
    `https:${url.replace('t_thumb', `t_${type}`)}`

const apiFetch = (endpoint: string, props: ApiProps) => {
    const url = BASE_URL + endpoint
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Client-ID': CLIENT_ID!,
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: getFetchBody(props),
    })
}

export const fetchGames = async (props: ApiProps) => {
    const response = await apiFetch('games', props)
    return await response.json()
}

export const fetchCovers = async (ids: number[]) => {
    const idsString = ids.join(',')
    const response = await apiFetch('covers', {
        fields: '*',
        where: `id = (${idsString})`,
        limit: UNLIMITED,
    })
    const result = (await response.json()) as Cover[]
    const gameCovers: {
        [key: number]: string
    } = {}
    result.forEach((r) => {
        gameCovers[r.game] = r.url ? modelImageUrl(r.url, 'cover_big_2x') : ''
    })
    return gameCovers
}

export const fetchGamesWithCovers = async (props: ApiProps) => {
    const gamesResponse = await apiFetch('games', props)
    const games = (await gamesResponse.json()) as Game[]
    const coverIds: number[] = []
    for (let game of games) {
        if (game.cover) coverIds.push(game.cover)
    }
    const covers = await fetchCovers(coverIds)
    games.forEach((game, index) => {
        games[index].coverUrl = covers[game.id]
    })
    return games
}
