import { fetchGames, fetchGamesWithCovers } from '@/lib/fetch'
import GameCard from '@/components/GameCard'

interface Game {
    id: number
    name: string
    cover: string
}

export default async function Games() {
    const games = await fetchGamesWithCovers({
        fields: ['name', 'cover'],
        limit: 200,
        sort: {
            field: 'rating_count',
            type: 'desc',
        },
    })
    return (
        <div className={'grid grid-cols-4 gap-6'}>
            {games.map((game) => {
                return <GameCard key={game.id} game={game} />
            })}
        </div>
    )
}
