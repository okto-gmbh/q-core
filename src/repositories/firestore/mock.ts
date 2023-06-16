/* eslint-disable sonarjs/cognitive-complexity */
import {
    deleteField,
    type Firestore as ClientFirestore,
    type WhereFilterOp as ClientWhereFilterOp
} from 'firebase/firestore'
import { FieldValue } from 'firebase-admin/firestore'

import type { Constraints } from '@core/repositories/firestore/admin'
import type { DB_Meta, ID, Table } from '@core/repositories/firestore/common'

import type {
    Firestore as AdminFirestore,
    WhereFilterOp as AdminWhereFilterOp
} from 'firebase-admin/firestore'

type DocumentData = {
    [key: string]: any
}

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

export function mockRepository() {
    return {
        default: (db: AdminFirestore | ClientFirestore) => {
            void db
            verifyMock.verifyMock()

            return {
                create: async <Collection extends DocumentData[]>(
                    table: Table,
                    data: Collection[number],
                    createId?: ID
                ) => {
                    DATABASE.data[table] ??= {}
                    const id = createId ?? DATABASE.id
                    DATABASE.data[table][id] = data

                    return id
                },
                find: async <Collection extends DocumentData[]>(
                    table: Table,
                    id: ID
                ): Promise<Collection[number] & DB_Meta> =>
                    DATABASE.data[table]?.[id] &&
                    mapDocs({
                        [id]: DATABASE.data[table]?.[id]
                    })[0],
                query: async <Collection extends DocumentData[]>(
                    table: Table,
                    constraints: Constraints<Collection> = {},
                    fields?: (keyof (Collection[number] & DB_Meta))[]
                ) => {
                    const { limit, orderBy, where } = constraints

                    let data = mapDocs(DATABASE.data[table] ?? {})

                    const ops = await getOps()

                    if (where) {
                        for (const [field, operation, value] of where) {
                            const resolvedField =
                                field === '__name__' ? 'id' : field
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
                            const resolvedField =
                                field === '__name__' ? 'id' : field

                            data = data.sort((a: any, b: any) => {
                                if (direction === 'asc') {
                                    return a[resolvedField] > b[resolvedField]
                                        ? 1
                                        : -1
                                }
                                return a[resolvedField] < b[resolvedField]
                                    ? 1
                                    : -1
                            })
                        }
                    }
                    if (limit) {
                        data = data.slice(0, limit)
                    }
                    if (fields) {
                        data = data.map((doc: any) =>
                            Object.entries(doc).reduce(
                                (acc: any, [key, value]) => {
                                    if (fields.includes(key)) {
                                        acc[key] = value
                                    }
                                    return acc
                                },
                                {}
                            )
                        )
                    }
                    return data
                },
                remove: async (table: Table, id: ID) => {
                    delete DATABASE.data[table]?.[id]
                },
                update: async <Collection extends DocumentData[]>(
                    table: Table,
                    id: ID,
                    data: Partial<Collection[number]>
                ) => {
                    DATABASE.data[table][id] = {
                        ...DATABASE.data[table][id],
                        ...data
                    }
                    Object.entries(DATABASE.data[table][id]).forEach(
                        ([key, value]) => {
                            if (
                                value === deleteField() ||
                                value === FieldValue.delete()
                            ) {
                                delete DATABASE.data[table][id][key]
                            }
                        }
                    )
                }
            }
        }
    }
}

export function seedMockRepository<Collection extends DocumentData[]>(
    table: Table,
    data: Collection
) {
    DATABASE.data[table] = {}
    for (const item of data) {
        DATABASE.data[table][item.id ?? DATABASE.id] = item
    }
}

export function resetMockRepository() {
    DATABASE._currentId = 0
    DATABASE.data = {}
}

export function getRawMockData() {
    return DATABASE.data
}

export function getMockDB() {
    return {} as AdminFirestore & ClientFirestore
}

export const verifyMock = {
    verifyMock() {
        return true
    }
}

function mapDocs(docs: Database['data']['table']) {
    return Object.entries(docs).map(([id, doc]) => ({ ...doc, id }))
}

async function getOps() {
    return await import('@core/repositories/operators')
}

function checkWhereFilterOp(
    expected: any,
    operator: AdminWhereFilterOp | ClientWhereFilterOp,
    actual: any,
    ops: Awaited<ReturnType<typeof getOps>> // vi.mock gets hoisted, so we need to dynamically import the operators
) {
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
        return expected.includes(actual)
    }
    if (operator === ops.OP_IN) {
        return actual.includes(expected)
    }
    if (operator === ops.OP_CONTAINS_ANY) {
        return expected.some((item: any) => actual.includes(item))
    }
    return false
}
