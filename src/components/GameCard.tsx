import Placeholder from '../../public/placeholder.svg'
import Link from 'next/link'
import { Game } from '@/lib/types'
import Image from 'next/image'
import { slugify } from '@/lib/utils'

export default async function GameCard({ game }: { game: Game }) {
    return (
        <Link href={`/game/${slugify(game.name)}`}>
            <div
                className={
                    'relative aspect-[3/4] w-[300px] rounded-lg border border-slate-200 overflow-hidden'
                }
            >
                <div
                    className={
                        'absolute bottom-0 z-10 p-4 pt-10 bg-gradient-to-t from-slate-950 to-transparent w-full font-bold text-xl text-slate-50'
                    }
                >
                    {game.name}
                </div>
                <Image
                    className={'object-cover'}
                    fill
                    src={game.coverUrl ?? Placeholder}
                    alt={game.name}
                    sizes={'300px'}
                />
            </div>
        </Link>
    )
}
