/* eslint-disable security/detect-child-process */
/* eslint-disable security/detect-non-literal-fs-filename */
import { exec } from 'child_process'
import { mkdir, writeFile } from 'fs/promises'
import { dirname } from 'path'

import * as dotenv from 'dotenv'

import type { Repository } from '@core/repositories/interface'
import type { Env } from '@core/scripts/common'

import type { Bucket } from '@google-cloud/storage'

type Context = {
    backupPath: string
    bucket: Bucket
    db: FirebaseFirestore.Firestore
    repo: Repository
}

const backup = async (
    type: string,
    name: string,
    data: any,
    basePath: string,
    json: boolean = true
) => {
    const backupPath = `${basePath}/${type}/${name}${json ? '.json' : ''}`

    await mkdir(dirname(backupPath), { recursive: true })
    await writeFile(backupPath, json ? JSON.stringify(data) : data, {
        encoding: 'utf-8'
    })
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
    const [files] = await ctx.bucket.getFiles()

    for (const file of files) {
        if (file.name.endsWith('/')) continue // Ignore directories

        console.log(`Backing up ${file.name}`)

        await backup(
            'storage/files',
            file.name,
            await file.download(),
            ctx.backupPath,
            false
        )
        await backup(
            'storage/metadata',
            file.name,
            await file.getMetadata(),
            ctx.backupPath
        )
    }
}

const backupIndexes = async ({ backupPath }: Context) =>
    new Promise((resolve, reject) => {
        exec(
            `firebase firestore:indexes > ${backupPath}/firestore.indexes.json`,
            (err) => {
                if (err) {
                    reject(err)
                    return
                }

                resolve(true)
            }
        )
    })

export interface BackupOptions {
    env: Env
    outputDir: string
    firestore?: boolean
    indexes?: boolean
    storage?: boolean
}

export default async ({
    env = 'prod',
    firestore = true,
    indexes = true,
    outputDir,
    storage = true
}: BackupOptions) => {
    const scope = env === 'dev' ? 'local' : env
    console.log(`Loading .env.${scope}`)
    dotenv.config({ path: `.env.${scope}` })

    const { getBucket } = await import('@core/services/firebaseAdmin')
    const { db, default: repo } = await import('@core/repositories/firestore')

    const bucket = getBucket()

    const ctx: Context = {
        backupPath: outputDir,
        bucket,
        db,
        repo
    }

    if (firestore) {
        await backupTables(ctx)
    }
    if (storage) {
        await backupStorage(ctx)
    }
    if (indexes) {
        await backupIndexes(ctx)
    }
}
