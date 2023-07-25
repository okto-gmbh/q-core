/* eslint-disable security/detect-child-process */
/* eslint-disable security/detect-non-literal-fs-filename */
import { createWriteStream } from 'node:fs'
import { Readable } from 'node:stream'
import { mkdir, writeFile } from 'fs/promises'
import { dirname } from 'path'

import * as dotenv from 'dotenv'

import type { Repository } from '@core/repositories/interface'
import type { BaseOptions } from '@core/scripts/common'
import type { Storage } from '@core/storage/interface'

type Context = {
    backupPath: string
    db: FirebaseFirestore.Firestore
    repo: Repository
    storage: Storage
}

const backup = async (
    type: string,
    name: string,
    data:
        | Record<string, unknown>
        | Array<unknown>
        | NodeJS.ReadableStream
        | string,
    basePath: string
) => {
    const json = typeof data === 'object' && !(data instanceof Readable)
    const backupPath = `${basePath}/${type}/${name}${json ? '.json' : ''}`

    await mkdir(dirname(backupPath), { recursive: true })

    if (typeof data === 'object') {
        if (data instanceof Readable) {
            await new Promise((resolve, reject) => {
                const writeStream = data.pipe(createWriteStream(backupPath))
                writeStream.on('finish', resolve)
                writeStream.on('error', reject)
            })
        } else {
            await writeFile(backupPath, JSON.stringify(data))
        }
    } else if (typeof data === 'string') {
        await writeFile(backupPath, data)
    }
}

const backupTables = async (ctx: Context) => {
    const tables = await ctx.db.listCollections()

    for (const { id: tableName } of tables) {
        console.log(`Backing up ${tableName}`)
        const data = await ctx.repo.query(tableName)

        await backup('tables', tableName, data, ctx.backupPath)
    }
}

const backupStorage = async (ctx: Context) => {
    const files = await ctx.storage.getFiles()

    for (const file of files) {
        if (file.endsWith('/')) continue // Ignore directories

        console.log(`Backing up ${file}`)

        await backup(
            'storage/files',
            file,
            ctx.storage.download(file),
            ctx.backupPath
        )
        await backup(
            'storage/metadata',
            file,
            await ctx.storage.getMetadata(file),
            ctx.backupPath
        )
    }
}

export interface BackupOptions extends BaseOptions {
    outputDir: string
    firestore?: boolean
    storage?: boolean
}

export default async ({
    env = 'prod',
    firestore = true,
    outputDir,
    storage: includeStorage = true
}: BackupOptions) => {
    const scope = env === 'dev' ? 'local' : env
    console.log(`Loading .env.${scope}`)
    dotenv.config({ path: `.env.${scope}` })

    const { getStorage } = await import('@core/storage/firebase/admin')
    const { getBucket } = await import('@core/services/firebaseAdmin')
    const { db, default: repo } = await import('@core/repositories/firestore')

    const bucket = getBucket()
    const storage = getStorage(bucket)

    const ctx: Context = {
        backupPath: outputDir,
        db,
        repo,
        storage
    }

    if (firestore) {
        await backupTables(ctx)
    }
    if (includeStorage) {
        await backupStorage(ctx)
    }
}
