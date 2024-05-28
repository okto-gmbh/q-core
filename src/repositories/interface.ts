import type * as operators from './operators'

export type ID = string
export type Table = string
export type DBMeta = { id: ID }
export type Entity = Record<string, any>
export type Operators = (typeof operators)[keyof typeof operators]

export interface Constraints<Row extends Entity> {
    limit?: number
    orderBy?: {
        [key in keyof Row]?: 'asc' | 'desc'
    }
    where?: [keyof Row, Operators, any][]
}

export interface RepositoryEventListeners {
    [event: string]: {
        [table: string]: RepositoryEventListener<any>[]
    }
}

export type RepositoryEvent = 'create' | 'update' | 'remove'
export type RepositoryEventListener<Row extends Entity> = (
    data: Row
) => Promise<void>
export interface Repository {
    bulkCreate: <Row extends Entity & Partial<DBMeta>>(
        table: Table,
        rows: Row[]
    ) => Promise<(Omit<Row, 'id'> & DBMeta)[]>

    bulkRemove: (table: Table, ids: ID[]) => Promise<void>

    bulkUpdate: <Row extends Entity>(table: Table, rows: Row[]) => Promise<void>

    create: <Row extends Entity>(
        table: Table,
        data: Row,
        createId?: ID
    ) => Promise<ID>

    find: <Row extends Entity>(
        table: Table,
        id: ID
    ) => Promise<(DBMeta & Row) | undefined>

    query: <Row extends Entity>(
        table: Table,
        constraints?: Constraints<Row>,
        fields?: (keyof (DBMeta & Row))[]
    ) => Promise<(DBMeta & Row)[]>

    queryCount: <Row extends Entity>(
        table: Table,
        constraints?: Constraints<Row>
    ) => Promise<number>

    remove: (table: Table, id: ID) => Promise<void>

    update: <Row extends Entity>(
        table: Table,
        id: ID,
        data: Partial<Row>
    ) => Promise<void>
}
