/* eslint-disable security/detect-non-literal-fs-filename */
// Steps to restore algolia:
// - [ ] Restore backup by running `gpg --passphrase "<passphrase>" --batch --quiet --yes --no-use-agent -o backup.tar.gz -d backup.tar.gz.gpg`
// - [ ] Run reset script to clear algolia indexes
// - [ ] Run this script to restore algolia indexes with its settings

import { readFile } from 'fs/promises'

import * as dotenv from 'dotenv'

import type { Repository } from '@core/repositories/interface'
import type { BaseOptions } from '@core/scripts/common'

import type { SearchClient } from 'algoliasearch'

type Context = {
    algolia: SearchClient
    backupPath: string
    indexes: string[]
    onCreate: (tableName: any, id: any, data: any) => Promise<void>
    repo: Repository
    restoreData: boolean
}

const loadBackup = async (indexName: string, backupPath: string) =>
    JSON.parse(
        await readFile(`${backupPath}/algolia/${indexName}.json`, {
            encoding: 'utf8'
        })
    )

const restore = async (
    indexName: string,
    { algolia, backupPath, onCreate, repo, restoreData }: Context
) => {
    console.log(`Restoring ${indexName}...`)
    await algolia
        .initIndex(indexName)
        .setSettings(await loadBackup(indexName, backupPath))
        .wait()

    if (restoreData) {
        for (const { id, ...data } of await repo.query(indexName)) {
            await onCreate(indexName, id, data)
        }
    }
}

const restoreIndexes = async (ctx: Context) => {
    for (const indexName of ctx.indexes) {
        await restore(`${indexName}`, ctx)
    }
}

export interface RestoreOptions extends BaseOptions {
    backupPath?: string
    indexes?: string[]
    restoreData?: boolean
}

export default async ({
    backupPath = '.',
    env = 'dev',
    indexes = [],
    restoreData = false
}: RestoreOptions) => {
    const scope = env === 'dev' ? 'local' : env
    console.log(`Loading .env.${scope}`)
    dotenv.config({ path: `.env.${scope}` })

    const { default: getAlgoliaClient } = await import('@core/services/algolia')

    const algolia = getAlgoliaClient(process.env.ALGOLIA_ADMIN_API_KEY)

    const { onCreate } = await import('~core/utils/algolia')
    const { default: repo } = await import('@core/repositories/firestore')

    const ctx: Context = {
        algolia,
        backupPath,
        indexes,
        onCreate,
        repo,
        restoreData
    }

    await restoreIndexes(ctx)
}
