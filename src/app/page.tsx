import { fetchGames } from '@/lib/fetch'
import Games from '@/components/Games'
import { Suspense } from 'react'
import GamesLoading from '@/components/loading/GamesLoading'

export default async function Home() {
    return (
        <div className={'container mx-auto py-7'}>
            <div className={'text-6xl text-slate-800 font-bold mb-8'}>
                Should you play
            </div>
            <Suspense fallback={<GamesLoading />}>
                <Games />
            </Suspense>
        </div>
    )
}
