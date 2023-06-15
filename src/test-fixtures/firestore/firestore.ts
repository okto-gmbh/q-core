/* eslint-disable sonarjs/cognitive-complexity */
import {
    Firestore as ClientFirestore,
    WhereFilterOp as ClientWhereFilterOp
} from 'firebase/firestore'
import {
    Firestore as AdminFirestore,
    Firestore,
    WhereFilterOp as AdminWhereFilterOp
} from 'firebase-admin/firestore'

import { Constraints } from '@core/repositories/firestore/admin'
import { DB_Meta, ID, Table } from '@core/repositories/firestore/common'

type DocumentData = any

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
                ) => DATABASE.data[table]?.[id] as Collection[number],
                query: async <Collection extends DocumentData[]>(
                    table: Table,
                    constraints: Constraints<Collection> = {},
                    fields?: (keyof (Collection[number] & DB_Meta))[]
                ) => {
                    const { limit, orderBy, where } = constraints

                    let data = Object.values(DATABASE.data[table])

                    if (where) {
                        for (const [field, operation, value] of where) {
                            data = data.filter((doc) =>
                                checkWhereFilterOp(doc[field], operation, value)
                            )
                        }
                    }
                    if (orderBy) {
                        for (const [field, direction = 'asc'] of Object.entries(
                            orderBy
                        )) {
                            data = data.sort((a: any, b: any) => {
                                if (direction === 'asc') {
                                    return a[field] > b[field] ? 1 : -1
                                }
                                return a[field] < b[field] ? 1 : -1
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
                }
            }
        }
    }
}

export function seedMockRepository<Collection extends DocumentData[]>(
    table: Table,
    data: Collection
) {
    DATABASE.data[table] ??= {}
    for (const item of data) {
        DATABASE.data[table][item.id ?? DATABASE.id] = item
    }
}

export function getRawData() {
    return DATABASE.data
}

export function resetMockRepository() {
    DATABASE._currentId = 0
    DATABASE.data = {}
}

export function getMockDB() {
    return {} as Firestore
}

export const verifyMock = {
    verifyMock() {
        return true
    }
}

function checkWhereFilterOp(
    expected: any,
    operator: AdminWhereFilterOp | ClientWhereFilterOp,
    actual: any
) {
    if (operator === '==') {
        return expected === actual
    }
    if (operator === '!=') {
        return expected !== actual
    }
    if (operator === '<') {
        return expected < actual
    }
    if (operator === '<=') {
        return expected <= actual
    }
    if (operator === '>') {
        return expected > actual
    }
    if (operator === '>=') {
        return expected >= actual
    }
    if (operator === 'array-contains') {
        return expected.includes(actual)
    }
    if (operator === 'in') {
        return actual.includes(expected)
    }
    if (operator === 'array-contains-any') {
        return expected.some((item: any) => actual.includes(item))
    }
    return false
}
