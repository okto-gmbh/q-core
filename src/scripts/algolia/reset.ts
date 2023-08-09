import * as dotenv from 'dotenv'

import type { BaseOptions } from '@core/scripts/common'

import type { SearchClient } from 'algoliasearch'

type ResetContext = {
    algolia: SearchClient
    indexes: string[]
}

const reset = async ({ algolia, indexes }: ResetContext) => {
    for (const indexName of indexes) {
        console.log(`Resetting ${indexName}...`)
        await algolia.initIndex(indexName).clearObjects()
    }
}

export interface ResetOptions extends BaseOptions {
    indexes: string[]
}

export default async ({ env = 'dev', indexes = [] }: ResetOptions) => {
    const scope = env === 'dev' ? 'local' : env
    console.log(`Loading .env.${scope}`)
    dotenv.config({ path: `.env.${scope}` })

    const { default: getAlgoliaClient } = await import('@core/services/algolia')

    const algolia = getAlgoliaClient(process.env.ALGOLIA_ADMIN_API_KEY)

    const ctx: ResetContext = {
        algolia,
        indexes
    }

    await reset(ctx)
}
