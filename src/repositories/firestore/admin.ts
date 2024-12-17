import admin from 'firebase-admin'

import { withEvents } from '@core/repositories/events'

import type { RepositoryWithEvents } from '@core/repositories/events'
import type {
    Constraints,
    DatabaseSchemaTemplate,
    ID,
    Operators,
    RowTemplate,
} from '@core/repositories/interface'

const enum COLUMN_TYPE {
    REFERENCE,
    TIMESTAMP,
    GEOPOINT,
    OTHER,
}

function getFieldType(prop: admin.firestore.DocumentData[string]): COLUMN_TYPE | undefined {
    if (prop === null) {
        return
    }
    if (prop instanceof admin.firestore.DocumentReference) {
        return COLUMN_TYPE.REFERENCE
    } else if (prop instanceof admin.firestore.Timestamp) {
        return COLUMN_TYPE.TIMESTAMP
    } else if (prop instanceof admin.firestore.GeoPoint) {
        return COLUMN_TYPE.GEOPOINT
    } else {
        return COLUMN_TYPE.OTHER
    }
}

async function mapRow(
    row: admin.firestore.DocumentSnapshot<admin.firestore.DocumentData> | undefined,
    fieldTypes: Record<string, COLUMN_TYPE> = {}
): Promise<Record<string, any> | undefined> {
    if (!row) {
        return
    }

    const data = row.data()

    const newData: Record<string, any> = {
        id: row.id,
    }

    for (const propName in data) {
        const prop = data[propName]

        if (prop === null || prop === undefined) {
            newData[propName] = prop
            continue
        }

        let fieldType = fieldTypes[propName]

        if (!fieldType || (fieldType === COLUMN_TYPE.OTHER && typeof prop === 'object')) {
            const type = getFieldType(prop)
            if (type !== undefined) {
                fieldTypes[propName] = type
                fieldType = type
            }
        }

        if (fieldType === COLUMN_TYPE.REFERENCE) {
            newData[propName] = async () => await mapRow(await prop.get())
        } else if (fieldType === COLUMN_TYPE.TIMESTAMP) {
            newData[propName] = prop.toDate()
        } else if (fieldType === COLUMN_TYPE.GEOPOINT) {
            newData[propName] = {
                latitude: prop.latitude,
                longitude: prop.longitude,
            }
        } else {
            newData[propName] = prop
        }
    }

    return newData
}

async function mapRows(rows: admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>[]) {
    if (rows.length === 0) {
        return []
    }

    const fieldTypes: Record<string, COLUMN_TYPE> = {}

    const mappedRows: (Record<string, any> | undefined)[] = []

    for (const row of rows) {
        mappedRows.push(mapRow(row, fieldTypes))
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
            const createPromises = []
            const createdRows: FirebaseEntity[] = []
            for (let i = 0; i < rows.length; i += 500) {
                const batch = db.batch()

                createdRows.push(
                    ...rows.slice(i, i + 500).map((row) => {
                        const doc = row.id
                            ? db.collection(table).doc(row.id)
                            : db.collection(table).doc()
                        batch.set(doc, row)
                        return {
                            ...row,
                            id: doc.id,
                        }
                    })
                )

                createPromises.push(batch.commit())
            }

            await Promise.all(createPromises)

            return createdRows
        },

        bulkRemove: async (table, ids) => {
            const removePromises = []
            for (let i = 0; i < ids.length; i += 500) {
                const batch = db.batch()

                for (const id of ids.slice(i, i + 500)) {
                    const doc = db.collection(table).doc(id)
                    batch.delete(doc)
                }

                removePromises.push(batch.commit())
            }

            await Promise.all(removePromises)
        },

        bulkUpdate: async (table, rows) => {
            const updatePromises = []
            for (let i = 0; i < rows.length; i += 500) {
                const batch = db.batch()

                for (const row of rows.slice(i, i + 500)) {
                    const doc = db.collection(table).doc(row.id)
                    batch.set(doc, row, { merge: true })
                }

                updatePromises.push(batch.commit())
            }

            await Promise.all(updatePromises)
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
            if (fields) {
                query = query.select(...fields)
            }
            if (limit) {
                query = query.limit(limit)
            }

            const { docs } = await query.get()

            const mappedRows = await mapRows(docs)

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
