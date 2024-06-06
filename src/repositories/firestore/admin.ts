import admin from 'firebase-admin'

import type { RepositoryWithEvents } from '@core/repositories/events'
import { withEvents } from '@core/repositories/events'
import type {
    Constraints,
    DatabaseSchemaTemplate,
    DBMeta,
    ID,
    Operators,
    RowTemplate
} from '@core/repositories/interface'

async function mapRow<
    Row extends RowTemplate,
    Fields extends (keyof Row & string)[] | undefined
>(
    row: admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>,
    fields?: Fields
): Promise<
    (Fields extends string[] ? Pick<Row, Fields[number]> : Row) | undefined
> {
    if (fields && fields.length === 1 && fields.includes('id')) {
        return {
            id: row.id
        } as unknown as Fields extends string[]
            ? Pick<Row, Fields[number]>
            : Row
    }

    const data = row.data() || {}
    data.id = row.id

    if (Object.keys(data).length === 1) {
        return
    }

    for (const propName in data) {
        // Exclude fields
        if (fields && !fields.includes(propName as keyof Row & string)) {
            delete data[propName]
            continue
        }

        // Map types
        const prop = data[propName]
        if (prop instanceof admin.firestore.DocumentReference) {
            data[propName] = await mapRow(await prop.get())
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

    return data as unknown as Fields extends string[]
        ? Pick<Row, Fields[number]>
        : Row
}

async function mapRows<
    Row extends RowTemplate,
    Fields extends (keyof Row & string)[]
>(
    rows: admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>[],
    fields?: Fields
) {
    return await Promise.all(rows.map(async (row) => await mapRow(row, fields)))
}

export type FirebaseEntity = RowTemplate

export interface FirebaseConstraints<Row extends RowTemplate>
    extends Constraints<Row> {
    orderBy?: {
        [key in keyof (Row & { __name__: string })]?: 'asc' | 'desc'
    }
    where?: [keyof (Row & { __name__: string }), Operators, any][]
}

export interface FirebaseRepository<
    DatabaseSchema extends DatabaseSchemaTemplate
> extends RepositoryWithEvents<DatabaseSchema> {
    query: <
        Table extends keyof DatabaseSchema & string,
        Row extends DatabaseSchema[Table],
        Fields extends (keyof Row & string)[] | undefined
    >(
        table: Table,
        constraints?: FirebaseConstraints<Row>,
        fields?: Fields
    ) => Promise<
        Fields extends string[]
            ? Pick<Row & DBMeta, Fields[number]>[]
            : (Row & DBMeta)[]
    >

    queryCount: <
        Table extends keyof DatabaseSchema & string,
        Row extends DatabaseSchema[Table]
    >(
        table: Table,
        constraints?: FirebaseConstraints<Row>
    ) => Promise<number>
}

const getRepository = <DatabaseSchema extends DatabaseSchemaTemplate>(
    db: admin.firestore.Firestore
) =>
    withEvents<DatabaseSchema>({
        bulkCreate: async (table, rows) => {
            const batch = db.batch()

            const createdRows = rows.map((row) => {
                const doc = row.id
                    ? db.collection(table).doc(row.id)
                    : db.collection(table).doc()
                batch.set(doc, row)
                return row
            })

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
                batch.set(doc, row, { merge: true })
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

        find: async <
            Table extends keyof DatabaseSchema & string,
            Row extends DatabaseSchema[Table]
        >(
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

            const mappedRows = await mapRow(doc)

            return mappedRows as Row
        },

        query: async <
            Table extends keyof DatabaseSchema & string,
            Row extends DatabaseSchema[Table],
            Fields extends (keyof Row & string)[] | undefined
        >(
            table: Table,
            constraints: FirebaseConstraints<Row> = {},
            fields?: Fields
        ) => {
            const { limit, orderBy, where } = constraints
            let query: admin.firestore.Query<RowTemplate> = db.collection(table)

            if (where) {
                for (const [field, operation, value] of where) {
                    query = query.where(field as string, operation, value)
                }
            }
            if (orderBy) {
                for (const [field, direction = 'asc'] of Object.entries(
                    orderBy
                )) {
                    query = query.orderBy(field, direction)
                }
            }
            if (limit) {
                query = query.limit(limit)
            }

            const { docs } = await query.get()
            const mappedRows = await mapRows(docs, fields)

            return mappedRows as Fields extends string[]
                ? Pick<Row & DBMeta, Fields[number]>[]
                : (Row & DBMeta)[]
        },

        queryCount: async (table, constraints = {}) => {
            const { where } = constraints
            let query: admin.firestore.Query<RowTemplate> = db.collection(table)

            if (where) {
                for (const [field, operation, value] of where) {
                    query = query.where(field as string, operation, value)
                }
            }

            const snapshot = await query.count().get()
            return snapshot.data().count
        },

        remove: async (table, id) => {
            await db.collection(table).doc(id).delete()
        },

        update: async (table, id, data) => {
            await db.collection(table).doc(id).update(data)
        }
    })

export default getRepository
