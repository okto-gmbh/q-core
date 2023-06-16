import repo from '@core/repositories/firestore'
import { OP_LT } from '@core/repositories/operators'

import type { NextApiHandler } from 'next'

type Token = {
    expiresAt: Date
}

const cleanup: NextApiHandler = async (_, res) => {
    try {
        for (const table of ['tokens', 'sessions']) {
            const expiredTokens = await repo.query<Token[]>(
                table,
                { where: [['expiresAt', OP_LT, new Date()]] },
                ['id']
            )
            for (const { id } of expiredTokens) {
                await repo.remove(table, id)
            }
        }

        res.status(200).end()
    } catch (e) {
        console.error(e)
        res.status(500).end()
    }
}

export default cleanup
