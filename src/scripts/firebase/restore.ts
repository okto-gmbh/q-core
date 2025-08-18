/* eslint-disable security/detect-non-literal-fs-filename */
// Steps to restore firebase:
// - [ ] Restore backup by running `gpg --passphrase "<passphrase>" --batch --quiet --yes --no-use-agent -o backup.tar.gz -d backup.tar.gz.gpg`
// - [ ] Run `firebase deploy` to set rules and indexes
// - [ ] Run this script to restore firestore data

import { readdir, readFile } from 'node:fs/promises'

import * as dotenv from 'dotenv'

import type { Repository } from '@core/repositories/interface'
import type { BaseOptions } from '@core/scripts/common'
import type { Metadata, Storage } from '@core/storage/interface'

const loadBackup = async (fileName: string, backupPath: string) =>
    JSON.parse(
        await readFile(`${backupPath}/firebase/${fileName}.json`, {
            encoding: 'utf8',
        })
    )

const restoreTables = async ({ backupPath, repo, schemas, tables, tenants }: Context) => {
    for (const table of tables) {
        console.log(`Restoring ${table}...`)
        const rows = (await loadBackup(`tables/${table}`, backupPath))
            .filter(({ tenantId }: any) => !tenants || tenants.includes(tenantId))
            .map((row: any) => schemas[table].cast(row))

        await repo.bulkCreate(table, rows)
    }
}

const getFiles = async (
    directory: string
): Promise<{ meta: string; name: string; path: string }[]> => {
    const files = []
    for (const path of await readdir(directory, { withFileTypes: true })) {
        if (path.isFile()) {
            const file = `${directory}/${path.name}`
            files.push({
                meta: file.replace('/files/', '/metadata/') + '.json',
                name: path.name,
                path: file,
            })
        } else {
            files.push(...(await getFiles(`${directory}/${path.name}`)))
        }
    }

    return files
}

const wait = (timeout = 100) => new Promise((resolve) => setTimeout(resolve, timeout))

const restoreStorage = async ({ backupPath, storage }: Context) => {
    const basePath = `${backupPath}/firebase/storage/files`
    const files = await getFiles(basePath)
    console.log(`Restoring ${files.length} files...`)

    for (const file of files) {
        const fileName = file.path.substring(basePath.length + 1)
        const metadata: Metadata = JSON.parse((await readFile(file.meta, 'utf8')) ?? '{}')

        const content = await readFile(file.path)

        await storage.upload(fileName, content, metadata)

        // Throttle uploads to avoid hitting rate limit
        await wait()
    }
}

export interface RestoreOptions extends BaseOptions {
    backupPath: string
    firestore?: boolean
    schemas?: Record<string, any>
    storage?: boolean
    tables?: string[]
    tenants?: string[]
}

type Context = {
    backupPath: string
    repo: Repository
    schemas: Record<string, any>
    storage: Storage
    tables: string[]
    tenants?: string[]
}

export default async ({
    backupPath = '.',
    env = 'dev',
    firestore = true,
    schemas = [],
    storage: includeStorage = true,
    tables = [],
    tenants,
}: RestoreOptions) => {
    const scope = env === 'dev' ? 'local' : env
    console.log(`Loading .env.${scope}`)
    dotenv.config({ path: `.env.${scope}` })

    const { default: repo } = await import('@core/repositories/firestore')
    const { getBucket } = await import('@core/services/firebaseAdmin')
    const { getStorage } = await import('@core/storage/firebase/admin')

    const storage = getStorage(getBucket())

    const ctx: Context = {
        backupPath,
        repo,
        schemas,
        storage,
        tables,
        tenants,
    }

    if (firestore) {
        await restoreTables(ctx)
    }

    if (includeStorage) {
        await restoreStorage(ctx)
    }
}
