import admin from 'firebase-admin'

import type {
    Constraints,
    DBMeta,
    Entity,
    ID,
    Operators,
    Repository,
    Table
} from '@core/repositories/interface'

/* eslint-disable no-redeclare */
async function mapDocs<Doc extends Entity>(
    doc: admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>,
    fields?: (keyof Doc)[]
): Promise<(DBMeta & Doc) | undefined>
async function mapDocs<Doc extends Entity>(
    doc: admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>[],
    fields?: (keyof Doc)[]
): Promise<(DBMeta & Doc)[] | undefined>
async function mapDocs<Doc extends Entity>(
    doc:
        | admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>
        | admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>[],
    fields?: (keyof Doc)[]
): Promise<(DBMeta & Doc) | (DBMeta & Doc)[] | undefined> {
    if (Array.isArray(doc)) {
        return (await Promise.all(
            doc.map(async (d) => await mapDocs(d, fields))
        )) as (DBMeta & Doc)[]
    }

    if (fields && fields.length === 1 && fields.includes('id')) {
        return {
            id: doc.id
        } as DBMeta & Doc
    }

    const data = doc.data() || {}
    data.id = doc.id

    if (Object.keys(data).length === 1) {
        return
    }

    for (const propName in data) {
        // Exclude fields
        if (fields && !fields.includes(propName)) {
            delete data[propName]
            continue
        }

        // Map types
        const prop = data[propName]
        if (prop instanceof admin.firestore.DocumentReference) {
            data[propName] = (
                (origProp) => async () =>
                    await mapDocs(await origProp.get())
            )(prop)
        }
        if (prop instanceof admin.firestore.Timestamp) {
            data[propName] = prop.toDate()
        }
        if (prop instanceof admin.firestore.GeoPoint) {
            data[propName] = {
                latitude: prop.latitude,
                longitude: prop.longitude
            }
        }
    }

    return data as DBMeta & Doc
}

export type FirebaseEntity = Entity

export interface FirebaseConstraints<Row extends Entity>
    extends Constraints<Row> {
    orderBy?: {
        [key in keyof (Row & { __name__: string })]?: 'asc' | 'desc'
    }
    where?: [keyof (Row & { __name__: string }), Operators, any][]
}

export interface FirebaseRepository extends Repository {
    query: <Row extends Entity>(
        table: Table,
        constraints?: FirebaseConstraints<Row>,
        fields?: (keyof (DBMeta & Row))[]
    ) => Promise<(DBMeta & Row)[]>

    queryCount: <Row extends Entity>(
        table: Table,
        constraints?: FirebaseConstraints<Row>
    ) => Promise<number>
}

const getRepository = (db: admin.firestore.Firestore): FirebaseRepository => ({
    bulkCreate: async (table, rows) => {
        const batch = db.batch()

        const createdRows = []
        for (const row of rows) {
            const doc = db.collection(table).doc()
            createdRows.push({
                id: doc.id,
                ...row
            })
            batch.set(doc, row)
        }

        await batch.commit()

        return createdRows
    },

    bulkRemove: async (table, ids) => {
        const batch = db.batch()

        for (const id of ids) {
            const doc = db.collection(table).doc(id)
            batch.delete(doc)
        }

        await batch.commit()
    },

    bulkUpdate: async (table, rows) => {
        const batch = db.batch()

        for (const row of rows) {
            const doc = db.collection(table).doc(row.id)
            batch.set(doc, row)
        }

        await batch.commit()
    },

    create: async (table, data, createId?) => {
        if (createId) {
            await db.collection(table).doc(createId).set(data)
            return createId
        }

        const { id } = await db.collection(table).add(data)
        return id
    },

    find: async (table: Table, id: ID) => {
        if (!id) {
            return
        }

        const doc = await db.collection(table).doc(id).get()
        if (!doc) {
            return
        }

        return await mapDocs(doc)
    },

    query: async (table, constraints = {}, fields?) => {
        const { limit, orderBy, where } = constraints
        let query: admin.firestore.Query<Entity> = db.collection(table)

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
        return (await mapDocs(docs, fields)) || []
    },

    queryCount: async (table, constraints = {}) => {
        const { where } = constraints
        let query: admin.firestore.Query<Entity> = db.collection(table)

        if (where) {
            for (const [field, operation, value] of where) {
                query = query.where(field as string, operation, value)
            }
        }

        const snapshot = await query.count().get()
        return snapshot.data().count
    },

    remove: async (table, id) => void db.collection(table).doc(id).delete(),

    update: async (table, id, data) =>
        void db.collection(table).doc(id).update(data)
})

export default getRepository
