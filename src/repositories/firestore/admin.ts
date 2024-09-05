/* eslint-disable no-redeclare */

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

function getColumnType(prop: admin.firestore.DocumentData[string]): ColumnType {
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

function mapRow<Row extends RowTemplate, Fields extends (keyof Row & string)[]>(
    row: admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>,
    fields?: Fields,
    fieldTypes?: Record<string, ColumnType>
): Promise<Row> | undefined {
    const rowData = row.data()

    if (!rowData) {
        return
    }

    const resolveFields = async () => {
        const newData: Record<string, any> = {
            id: row.id,
        }
        for (const propName in rowData) {
            const prop = rowData[propName]

            const fieldType = fieldTypes?.[propName] ?? getColumnType(prop)

            if (!fields || fields.includes(propName)) {
                if (!prop) {
                    newData[propName] = prop
                }

                if (fieldType === 'reference') {
                    newData[propName] = await mapRow(prop.get(), fields)
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
        return newData as Row
    }

    return resolveFields()
}

async function mapRows<Row extends RowTemplate, Fields extends (keyof Row & string)[]>(
    rows: admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>[],
    fields?: Fields
) {
    if (rows.length === 0) {
        return []
    }

    const onlyId = fields && fields.length === 1 && fields.includes('id')

    if (onlyId) {
        const mappedRows: RowTemplate[] = []
        for (const row of rows) {
            mappedRows.push({ id: row.id })
        }
        return mappedRows
    } else {
        const fieldTypes: Record<string, ColumnType> = {}

        for (const row of rows) {
            const rowData = row.data()

            if (!rowData) {
                continue
            }

            for (const propName in rowData) {
                const prop = rowData[propName]
                const fieldType = getColumnType(prop)
                fieldTypes[propName] = fieldType
            }
            break
        }

        const mappedRows: Row[] = []
        for (const row of rows) {
            const mappedRow = mapRow(row, fields, fieldTypes)
            if (mappedRow) {
                mappedRows.push(mappedRow)
            }
        }

        return Promise.all(mappedRows)
    }
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

            const mappedRows = await mapRow(doc)

            return mappedRows as Row
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
            console.time('query' + table + JSON.stringify(constraints, fields))
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

            console.timeEnd('query' + table + JSON.stringify(constraints, fields))

            const timestamp = Date.now()

            const { docs } = await query.get()

            console.time('mapRows ' + table + timestamp)
            const mappedRows = await mapRows(docs, fields)
            console.timeEnd('mapRows ' + table + timestamp)

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
