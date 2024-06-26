import * as dotenv from 'dotenv'

import type { Repository } from '@core/repositories/interface'
import type { BaseOptions } from '@core/scripts/common'
import type { Storage } from '@core/storage/interface'

import type { SearchClient } from 'algoliasearch'

export const ALL_TENANTS = 'all'

export type Migrations = {
    [entity: string]: (id: string, data: any, ctx: MigrationContext) => any
}

export interface MigrationOptions extends BaseOptions {
    migrations: Migrations
    tenant?: string
}

export type MigrationContext = {
    algolia: SearchClient
    db: FirebaseFirestore.Firestore
    deleteField: () => FirebaseFirestore.FieldValue
    onCreate: (tableName: any, id: any, data: any) => Promise<void>
    onDelete: (tableName: any, id: any) => Promise<void>
    onUpdate: (tableName: any, id: any, data: any) => Promise<void>
    repo: Repository
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
                if (
                    ctx.tenantId !== ALL_TENANTS &&
                    doc.tenantId !== ctx.tenantId
                )
                    continue

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

export default async ({
    env = 'dev',
    migrations,
    tenant = ALL_TENANTS
}: MigrationOptions) => {
    const scope = env === 'dev' ? 'local' : env
    console.log(`Loading .env.${scope}`)
    dotenv.config({ path: `.env.${scope}` })

    // FIXME: Make this work without doku dependency `onUpdate` and `onDelete`
    const { default: getAlgoliaClient } = await import('@core/services/algolia')
    const { onCreate, onDelete, onUpdate } = await import('~core/utils/algolia')
    const { getBucket } = await import('@core/services/firebaseAdmin')
    const { getStorage } = await import('@core/storage/firebase/admin')

    const storage = getStorage(getBucket())

    const {
        db,
        default: repo,
        deleteField
    } = await import('@core/repositories/firestore')

    const algolia = getAlgoliaClient(process.env.ALGOLIA_ADMIN_API_KEY)

    const ctx: MigrationContext = {
        algolia,
        db,
        deleteField,
        onCreate,
        onDelete,
        onUpdate,
        repo,
        storage,
        tenantId: tenant
    }

    await migrate(migrations, ctx)
}
