import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

import type { Repository } from '@core/repositories/interface'
import type { BaseOptions } from '@core/scripts/common'
import type { Storage } from '@core/storage/interface'

export const ALL_TENANTS = 'all'

export type Migrations = {
    [entity: string]: (id: string, data: any, ctx: MigrationContext) => any
}

export interface MigrationOptions extends BaseOptions {
    migrations: Migrations
    tenant?: string
}

export type MigrationContext = {
    db: FirebaseFirestore.Firestore
    deleteField: () => FirebaseFirestore.FieldValue
    prisma: PrismaClient
    repo: Repository<any>
    storage: Storage
    tenantId: string
}

const migrate = async (migrations: Migrations = {}, ctx: MigrationContext) => {
    console.time('duration')

    for (const [tableName, execMigrate] of Object.entries(migrations)) {
        console.log('processing ' + tableName)
        console.time(tableName)

        const docs = await ctx.repo.query(tableName)
        for (const doc of docs) {
            try {
                if (ctx.tenantId !== ALL_TENANTS && doc.tenantId !== ctx.tenantId) continue

                const data = await execMigrate(doc.id, doc, ctx)
                if (!data) {
                    // Remove
                    await ctx.db.collection(tableName).doc(doc.id).delete()
                } else {
                    // Update
                    await ctx.db.collection(tableName).doc(doc.id).update(data)
                }
            } catch (e) {
                console.error(tableName, doc.id)
                throw e
            }
        }

        console.timeEnd(tableName)
    }

    console.timeEnd('duration')
}

export default async ({ env = 'dev', migrations, tenant = ALL_TENANTS }: MigrationOptions) => {
    const scope = env === 'dev' ? 'local' : env
    console.log(`Loading .env.${scope}`)
    dotenv.config({ path: `.env.${scope}` })

    const { getBucket } = await import('@core/services/firebaseAdmin')
    const { getStorage } = await import('@core/storage/firebase/admin')
    const { db: prisma } = await import('~db/services/prisma')

    const storage = getStorage(getBucket())

    const { db, default: repo, deleteField } = await import('@core/repositories/firestore')

    const ctx: MigrationContext = {
        db,
        deleteField,
        prisma,
        repo,
        storage,
        tenantId: tenant,
    }

    await migrate(migrations, ctx)
}
