/* eslint-disable no-redeclare */

import * as admin from 'firebase-admin'
import { Field, ID, Table } from './common'

export interface Constraints<Collection extends admin.DocumentData[]> {
    where?: [keyof Collection[number], admin.WhereFilterOp, any][]
    orderBy?: {
        [key in keyof Collection[number]]?: admin.OrderByDirection
    }
    limit?: number
}

async function mapDocs<Collection extends admin.firestore.DocumentData[]>(
    doc: admin.firestore.DocumentSnapshot<Collection[number]>,
    fields?: string[]
): Promise<({ id: string } & Collection[number]) | undefined>
async function mapDocs<Collection extends admin.firestore.DocumentData[]>(
    doc: admin.firestore.DocumentSnapshot<Collection[number]>[],
    fields?: string[]
): Promise<({ id: string } & Collection[number])[] | undefined>
async function mapDocs<Collection extends admin.firestore.DocumentData[]>(
    doc:
        | admin.firestore.DocumentSnapshot<Collection[number]>
        | admin.firestore.DocumentSnapshot<Collection[number]>[],
    fields?: string[]
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
            prop = async () => await mapDocs(await prop.get())
        }
        if (prop instanceof admin.firestore.Timestamp) {
            prop = prop.toDate()
        }

        acc[propName] = prop
        return acc
    }, <{ [key: string]: any }>{})
}

const getRepository = (db: admin.firestore.Firestore) => ({
    find: async <Collection extends admin.firestore.DocumentData[]>(
        table: Table,
        id: ID
    ) => {
        const doc = await db.collection(table).doc(id).get()
        if (!doc) {
            return
        }

        return await mapDocs<Collection>(doc)
    },

    query: async <Collection extends admin.firestore.DocumentData[]>(
        table: Table,
        constraints: Constraints<Collection>,
        fields?: Field[]
    ) => {
        const { where, orderBy, limit } = constraints
        let query: admin.firestore.Query<Collection[number]> =
            db.collection(table)

        if (where) {
            for (const condition of where) {
                query = query.where(
                    ...(condition as [
                        string,
                        admin.firestore.WhereFilterOp,
                        any
                    ])
                )
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
        return await mapDocs<Collection>(docs, fields)
    },

    remove: async (table: string, id: string) =>
        await db.collection(table).doc(id).delete(),

    update: async <Collection extends admin.firestore.DocumentData[]>(
        table: string,
        id: string,
        data: Partial<Collection[number]>
    ) => await db.collection(table).doc(id).update(data),

    create: async <Collection extends admin.firestore.DocumentData[]>(
        table: string,
        data: Collection[number]
    ) => {
        const { id } = await db.collection(table).add(data)
        return id
    }
})

export default getRepository
