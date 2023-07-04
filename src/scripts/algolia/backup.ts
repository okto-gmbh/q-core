/* eslint-disable security/detect-non-literal-fs-filename */
import { access, mkdir, writeFile } from 'fs/promises'

import dotenv from 'dotenv'

import type { Env } from '@core/scripts/common'

import type { SearchClient } from 'algoliasearch'

type Context = {
    backupPath: string
    client: SearchClient
}

type BackupContext = Context & {
    indexName: string
}

const backupIndex = async ({
    backupPath,
    client,
    indexName
}: BackupContext) => {
    const settings = await client.initIndex(indexName).getSettings()

    await writeFile(
        `${backupPath}/${indexName}.json`,
        JSON.stringify(settings),
        {
            encoding: 'utf-8'
        }
    )
}

const backupIndexes = async ({ backupPath, client }: Context) => {
    const { items: indexes } = await client.listIndices()
    for (const { name: indexName } of indexes) {
        await backupIndex({ backupPath, client, indexName })
    }
}

export interface BackupOptions {
    outputDir: string
    env?: Env
}

export default async ({ env = 'prod', outputDir }: BackupOptions) => {
    const scope = env === 'dev' ? 'local' : env
    console.log(`Loading .env.${scope}`)
    dotenv.config({ path: `.env.${scope}` })

    const { default: getAlgoliaClient } = await import('@core/services/algolia')

    const ctx: Context = {
        backupPath: outputDir,
        client: getAlgoliaClient(process.env.ALGOLIA_ADMIN_API_KEY)
    }

    try {
        await access(outputDir)
    } catch {
        await mkdir(outputDir, { recursive: true })
    }

    await backupIndexes(ctx)
}
