import type * as operators from './operators'

export type ID = string
export type DBMeta = { id: ID }
export type RowTemplate = { [field: string]: any }
export type DatabaseSchemaTemplate = { [table: string]: RowTemplate }
export type Operators = (typeof operators)[keyof typeof operators]

export interface Constraints<Row extends RowTemplate> {
    limit?: number
    orderBy?: {
        [key in keyof Row]?: 'asc' | 'desc'
    }
    where?: [keyof Row, Operators, any][]
}

export interface Repository<DatabaseSchema extends DatabaseSchemaTemplate> {
    bulkCreate: <Table extends keyof DatabaseSchema & string>(
        table: Table,
        rows: DatabaseSchema[Table][]
    ) => Promise<(DatabaseSchema[Table] & DBMeta)[]>

    bulkRemove: <Table extends keyof DatabaseSchema & string>(
        table: Table,
        ids: ID[]
    ) => Promise<void>

    bulkUpdate: <Table extends keyof DatabaseSchema & string>(
        table: Table,
        rows: (Partial<Omit<DatabaseSchema[Table], 'id'>> & DBMeta)[]
    ) => Promise<void>

    create: <Table extends keyof DatabaseSchema & string>(
        table: Table,
        data: DatabaseSchema[Table],
        createId?: ID
    ) => Promise<ID>

    find: <Table extends keyof DatabaseSchema & string>(
        table: Table,
        id: ID
    ) => Promise<(DatabaseSchema[Table] & DBMeta) | undefined>

    query: <
        Table extends keyof DatabaseSchema & string,
        Fields extends (keyof DatabaseSchema[Table] & string)[] | undefined
    >(
        table: Table,
        constraints?: Constraints<DatabaseSchema[Table]>,
        fields?: Fields
    ) => Promise<
        Fields extends string[]
            ? Pick<DatabaseSchema[Table] & DBMeta, Fields[number]>[]
            : (DatabaseSchema[Table] & DBMeta)[]
    >

    queryCount: <Table extends keyof DatabaseSchema & string>(
        table: Table,
        constraints?: Constraints<DatabaseSchema[Table]>
    ) => Promise<number>

    remove: <Table extends keyof DatabaseSchema & string>(
        table: Table,
        id: ID
    ) => Promise<void>

    update: <Table extends keyof DatabaseSchema & string>(
        table: Table,
        id: ID,
        data: Partial<DatabaseSchema[Table]>
    ) => Promise<void>
}
