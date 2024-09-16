import { withCovers } from '@/lib/fetch'
import GameCard from '@/components/GameCard'
import api from '@/lib/api/api'
import { Game } from '@/lib/types'

export default async function Games() {
    const games = await api()
        .fields(['name', 'cover'])
        .sort('rating_count', 'desc')
        .limit(30)
        .get<Game[]>('games', withCovers)

    return (
        <div className={'grid grid-cols-4 gap-6'}>
            {games.map((game) => {
                return <GameCard key={game.id} game={game} />
            })}
        </div>
    )
}
