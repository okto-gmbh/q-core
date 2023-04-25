/* eslint-disable no-redeclare */

import * as admin from 'firebase-admin'

import { DB_Meta, ID, Table } from './common'

export interface Constraints<
    Collection extends admin.firestore.DocumentData[]
> {
    limit?: number
    orderBy?: {
        [key in keyof Collection[number]]?: admin.firestore.OrderByDirection
    }
    where?: [
        keyof (Collection[number] & { __name__: string }),
        admin.firestore.WhereFilterOp,
        any
    ][]
}

async function mapDocs<Collection extends admin.firestore.DocumentData[]>(
    doc: admin.firestore.DocumentSnapshot<Collection[number]>,
    fields?: (keyof (Collection[number] & DB_Meta))[]
): Promise<(DB_Meta & Collection[number]) | undefined>
async function mapDocs<Collection extends admin.firestore.DocumentData[]>(
    doc: admin.firestore.DocumentSnapshot<Collection[number]>[],
    fields?: (keyof (Collection[number] & DB_Meta))[]
): Promise<(DB_Meta & Collection[number])[] | undefined>
async function mapDocs<Collection extends admin.firestore.DocumentData[]>(
    doc:
        | admin.firestore.DocumentSnapshot<Collection[number]>
        | admin.firestore.DocumentSnapshot<Collection[number]>[],
    fields?: (keyof (Collection[number] & DB_Meta))[]
) {
    if (Array.isArray(doc)) {
        return await Promise.all(
            doc.map(async (d) => await mapDocs<Collection>(d, fields))
        )
    }

    if (fields && fields.length === 1 && fields.includes('id')) {
        return {
            id: doc.id
        }
    }

    const data: admin.firestore.DocumentData = {
        ...doc.data(),
        id: doc.id
    }

    if (Object.keys(data).length === 1) {
        return
    }

    return Object.entries(data).reduce((acc, [propName, prop]) => {
        // Exclude fields
        if (fields && !fields.includes(propName)) {
            return acc
        }

        // Map types
        if (prop instanceof admin.firestore.DocumentReference) {
            prop = (
                (origProp) => async () =>
                    await mapDocs(await origProp.get())
            )(prop)
        }
        if (prop instanceof admin.firestore.Timestamp) {
            prop = prop.toDate()
        }
        if (prop instanceof admin.firestore.GeoPoint) {
            prop = {
                latitude: prop.latitude,
                longitude: prop.longitude
            }
        }

        acc[propName] = prop
        return acc
    }, <{ [key: string]: any }>{})
}

const getRepository = (db: admin.firestore.Firestore) => ({
    create: async <Collection extends admin.firestore.DocumentData[]>(
        table: Table,
        data: Collection[number],
        createId?: string
    ) => {
        if (createId) {
            await db.collection(table).doc(createId).set(data)
            return createId
        }

        const { id } = await db.collection(table).add(data)
        return id
    },

    find: async <Collection extends admin.firestore.DocumentData[]>(
        table: Table,
        id: ID
    ) => {
        if (!id) {
            return
        }

        const doc = await db.collection(table).doc(id).get()
        if (!doc) {
            return
        }

        return await mapDocs<Collection>(doc)
    },

    query: async <Collection extends admin.firestore.DocumentData[]>(
        table: Table,
        constraints: Constraints<Collection> = {},
        fields?: (keyof (Collection[number] & DB_Meta))[]
    ) => {
        const { where, orderBy, limit } = constraints
        let query: admin.firestore.Query<Collection[number]> =
            db.collection(table)

        if (where) {
            for (const [field, operation, value] of where) {
                query = query.where(field as string, operation, value)
            }
        }
        if (orderBy) {
            for (const [field, direction = 'asc'] of Object.entries(orderBy)) {
                query = query.orderBy(field, direction)
            }
        }
        if (limit) {
            query = query.limit(limit)
        }

        const { docs } = await query.get()
        return (await mapDocs<Collection>(docs, fields)) || []
    },

    remove: async (table: Table, id: ID) =>
        await db.collection(table).doc(id).delete(),

    update: async <Collection extends admin.firestore.DocumentData[]>(
        table: Table,
        id: ID,
        data: Partial<Collection[number]>
    ) => await db.collection(table).doc(id).update(data)
})

export default getRepository
