/* eslint-disable sonarjs/cognitive-complexity */

import { FieldValue } from 'firebase-admin/firestore'

import type {
    FirebaseListeners,
    FirebaseRepository
} from '@core/repositories/firestore/admin'
import type {
    DBMeta,
    Entity,
    Operators,
    RepositoryEvent,
    RepositoryEventListener,
    Table
} from '@core/repositories/interface'

import type { Firestore } from 'firebase-admin/firestore'

interface Database {
    _currentId: number
    data: {
        [table: string]: {
            [id: string]: any
        }
    }
    get id(): string
}

const DATABASE: Database = {
    _currentId: 0,
    data: {},
    get id() {
        return `${this._currentId++}`
    }
}

const getRepository = (db: Firestore): FirebaseRepository => {
    verifyMock.verifyMock()

    void db

    const listeners: FirebaseListeners = {}

    const triggerEvent = async (
        event: RepositoryEvent,
        table: Table,
        data: Entity
    ) => {
        const eventListeners = listeners[event]?.[table]
        if (!eventListeners) {
            return
        }

        for (const listener of eventListeners) {
            await listener(data)
        }
    }

    return {
        bulkCreate: async (table, rows) => {
            DATABASE.data[table] ??= {}

            type Row = (typeof rows)[number] & DBMeta

            const createdRows: Row[] = []
            for (const row of rows) {
                const id = DATABASE.id
                DATABASE.data[table][id] = transformFieldValue(row)

                createdRows.push(<Row>{
                    id,
                    ...transformFieldValue(row)
                })
            }

            await triggerEvent('create', table, createdRows)

            return createdRows
        },
        bulkRemove: async (table, ids) => {
            DATABASE.data[table] ??= {}

            for (const id of ids) {
                delete DATABASE.data[table][id]
            }

            await triggerEvent('remove', table, { id: ids })
        },
        bulkUpdate: async (table, rows) => {
            DATABASE.data[table] ??= {}

            for (const { id, ...data } of rows) {
                DATABASE.data[table][id] = transformFieldValue({
                    ...DATABASE.data[table][id],
                    ...data
                })
            }

            await triggerEvent('update', table, rows)
        },
        create: async (table, data, createId?) => {
            DATABASE.data[table] ??= {}
            const id = createId ?? DATABASE.id
            DATABASE.data[table][id] = transformFieldValue(data)

            await triggerEvent('create', table, { id, ...data })

            return id
        },
        find: async (table, id) =>
            DATABASE.data[table]?.[id] &&
            mapDocs({
                [id]: DATABASE.data[table][id]
            })[0],
        off<Row extends Entity>(
            event: RepositoryEvent,
            table: Table,
            callback?: RepositoryEventListener<Row>
        ) {
            if (!listeners[event]?.[table]) {
                return
            }

            if (callback) {
                listeners[event][table] = listeners[event][table].filter(
                    (cb) => cb !== callback
                )
            } else {
                listeners[event][table] = []
            }
        },
        on<Row extends Entity>(
            event: RepositoryEvent,
            table: Table,
            callback: RepositoryEventListener<Row>
        ) {
            listeners[event] ??= {}
            listeners[event]![table] ??= []
            listeners[event]![table]!.push(callback)
        },
        query: async (table, constraints = {}, fields?) => {
            const { limit, orderBy, where } = constraints

            let data = mapDocs(DATABASE.data[table] ?? {})

            const ops = await getOps()

            if (where) {
                for (const [field, operation, value] of where) {
                    const resolvedField = field === '__name__' ? 'id' : field
                    data = data.filter((doc) =>
                        checkWhereFilterOp(
                            doc[resolvedField],
                            operation,
                            value,
                            ops
                        )
                    )
                }
            }
            if (orderBy) {
                for (const [field, direction = 'asc'] of Object.entries(
                    orderBy
                )) {
                    const resolvedField = field === '__name__' ? 'id' : field

                    data = data.sort((a: any, b: any) => {
                        if (direction === 'asc') {
                            return a[resolvedField] > b[resolvedField] ? 1 : -1
                        }
                        return a[resolvedField] < b[resolvedField] ? 1 : -1
                    })
                }
            }
            if (limit) {
                data = data.slice(0, limit)
            }
            if (fields) {
                data = data.map((doc: any) =>
                    Object.entries(doc).reduce((acc: any, [key, value]) => {
                        if (fields.includes(key)) {
                            acc[key] = value
                        }
                        return acc
                    }, {})
                )
            }
            return data
        },
        queryCount: async (table, constraints = {}) => {
            const { where } = constraints

            let data = mapDocs(DATABASE.data[table] ?? {})

            const ops = await getOps()

            if (where) {
                for (const [field, operation, value] of where) {
                    const resolvedField = field === '__name__' ? 'id' : field
                    data = data.filter((doc) =>
                        checkWhereFilterOp(
                            doc[resolvedField],
                            operation,
                            value,
                            ops
                        )
                    )
                }
            }
            return data.length
        },
        remove: async (table, id) => {
            delete DATABASE.data[table][id]
            await triggerEvent('remove', table, { id })
        },
        update: async (table, id, data) => {
            DATABASE.data[table][id] = transformFieldValue({
                ...DATABASE.data[table][id],
                ...data
            })
            await triggerEvent('update', table, { id, ...data })
        }
    }
}

export default getRepository

export const seedMockRepository = <Rows extends Entity[]>(
    table: Table,
    data: Rows
) => {
    DATABASE.data[table] ??= {}
    for (const item of data) {
        DATABASE.data[table][item.id ?? DATABASE.id] = item
    }
}

export const resetMockRepository = () => {
    DATABASE._currentId = 0
    DATABASE.data = {}
}

export const getRawMockData = () => DATABASE.data
export const getMockDB = () => ({}) as Firestore
const getOps = async () => await import('@core/repositories/operators')

export const verifyMock = {
    verifyMock() {
        return true
    }
}

const transformFieldValue = (data: Entity) =>
    Object.fromEntries(
        Object.entries(data).filter(
            ([, value]) =>
                JSON.stringify(value) !== JSON.stringify(FieldValue.delete())
        )
    )

const mapDocs = (docs: Database['data']['table']) =>
    Object.entries(docs).map(([id, doc]) => ({ ...doc, id }))

const checkWhereFilterOp = (
    expected: any,
    operator: Operators,
    actual: any,
    ops: Awaited<ReturnType<typeof getOps>> // vi.mock gets hoisted, so we need to dynamically import the operators
) => {
    if (operator === ops.OP_EQUALS) {
        return expected === actual
    }
    if (operator === ops.OP_NOT_EQUALS) {
        return expected !== actual
    }
    if (operator === ops.OP_LT) {
        return expected < actual
    }
    if (operator === ops.OP_LT_OR_EQUALS) {
        return expected <= actual
    }
    if (operator === ops.OP_GT) {
        return expected > actual
    }
    if (operator === ops.OP_GT_OR_EQUALS) {
        return expected >= actual
    }
    if (operator === ops.OP_CONTAINS) {
        return Array.isArray(expected) && expected.includes(actual)
    }
    if (operator === ops.OP_IN) {
        return Array.isArray(actual) && actual.includes(expected)
    }
    if (operator === ops.OP_CONTAINS_ANY) {
        return (
            Array.isArray(expected) &&
            expected.some((item: any) => actual.includes(item))
        )
    }
    if (operator === ops.OP_NOT_IN) {
        return Array.isArray(actual) && !actual.includes(expected)
    }
    return false
}
