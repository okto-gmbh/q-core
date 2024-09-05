import admin from 'firebase-admin'

import type { RepositoryWithEvents } from '@core/repositories/events'
import { withEvents } from '@core/repositories/events'
import type {
    Constraints,
    DatabaseSchemaTemplate,
    ID,
    Operators,
    RowTemplate,
} from '@core/repositories/interface'

type ColumnType = 'geopoint' | 'other' | 'reference' | 'timestamp'

function getFieldType(prop: admin.firestore.DocumentData[string]): ColumnType | undefined {
    if (prop === null) {
        return
    }
    if (prop instanceof admin.firestore.DocumentReference) {
        return 'reference'
    } else if (prop instanceof admin.firestore.Timestamp) {
        return 'timestamp'
    } else if (prop instanceof admin.firestore.GeoPoint) {
        return 'geopoint'
    } else {
        return 'other'
    }
}

async function mapRow(
    row: admin.firestore.DocumentSnapshot<admin.firestore.DocumentData> | undefined,
    fields?: string[],
    fieldTypes: Record<string, ColumnType> = {}
): Promise<Record<string, any> | undefined> {
    if (!row) {
        return
    }

    const data = row.data()

    const newData: Record<string, any> = {
        id: row.id,
    }

    for (const propName in data) {
        if (!fields || fields.includes(propName)) {
            const prop = data[propName]

            if (prop === null || prop === undefined) {
                newData[propName] = prop
                continue
            }

            let fieldType = fieldTypes[propName]

            if (!fieldType || (fieldType === 'other' && typeof prop === 'object')) {
                const type = getFieldType(prop)
                if (type) {
                    fieldTypes[propName] = type
                    fieldType = type
                }
            }

            if (fieldType === 'reference') {
                newData[propName] = await mapRow(await prop.get())
            } else if (fieldType === 'timestamp') {
                newData[propName] = prop.toDate()
            } else if (fieldType === 'geopoint') {
                newData[propName] = {
                    latitude: prop.latitude,
                    longitude: prop.longitude,
                }
            } else {
                newData[propName] = prop
            }
        }
    }

    if (Object.keys(newData).length === 1) {
        return
    }

    return newData
}

async function mapRows(
    rows: admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>[],
    fields?: string[]
) {
    if (rows.length === 0) {
        return []
    }

    if (fields && fields.length === 1 && fields.includes('id')) {
        const mappedRows: RowTemplate[] = []
        for (const row of rows) {
            mappedRows.push({ id: row.id })
        }
        return mappedRows
    }

    const fieldTypes: Record<string, ColumnType> = {}

    const mappedRows: (Record<string, any> | undefined)[] = []

    for (const row of rows) {
        mappedRows.push(mapRow(row, fields, fieldTypes))
    }

    return await Promise.all(mappedRows)
}

export type FirebaseEntity = RowTemplate

export interface FirebaseConstraints<Row extends RowTemplate> extends Constraints<Row> {
    orderBy?: {
        [key in keyof (Row & { __name__: string })]?: 'asc' | 'desc'
    }
    where?: [keyof (Row & { __name__: string }), Operators, any][]
}

export interface FirebaseRepository<DatabaseSchema extends DatabaseSchemaTemplate>
    extends RepositoryWithEvents<DatabaseSchema> {
    query: <
        Table extends keyof DatabaseSchema & string,
        Fields extends (keyof DatabaseSchema[Table]['all'] & string)[] | undefined,
    >(
        table: Table,
        constraints?: FirebaseConstraints<DatabaseSchema[Table]['all']>,
        fields?: Fields
    ) => Promise<
        Fields extends string[]
            ? Pick<DatabaseSchema[Table]['all'], Fields[number]>[]
            : DatabaseSchema[Table]['all'][]
    >

    queryCount: <const Table extends keyof DatabaseSchema & string>(
        table: Table,
        constraints?: FirebaseConstraints<DatabaseSchema[Table]['all']>
    ) => Promise<number>
}

const getRepository = <DatabaseSchema extends DatabaseSchemaTemplate>(
    db: admin.firestore.Firestore
) =>
    withEvents<DatabaseSchema>({
        bulkCreate: async (table, rows) => {
            const batch = db.batch()

            const createdRows = rows.map((row) => {
                const doc = row.id ? db.collection(table).doc(row.id) : db.collection(table).doc()
                batch.set(doc, row)
                return {
                    ...row,
                    id: doc.id,
                }
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
            Row extends DatabaseSchema[Table]['all'],
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

            return (await mapRow(doc)) as Row
        },

        query: async <
            Table extends keyof DatabaseSchema & string,
            Row extends DatabaseSchema[Table]['all'],
            Fields extends (keyof Row & string)[] | undefined,
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
                for (const [field, direction = 'asc'] of Object.entries(orderBy)) {
                    query = query.orderBy(field, direction)
                }
            }
            if (limit) {
                query = query.limit(limit)
            }

            const { docs } = await query.get()

            const mappedRows = await mapRows(docs, fields)

            return mappedRows as Fields extends string[] ? Pick<Row, Fields[number]>[] : Row[]
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
        },
    })

export default getRepository
