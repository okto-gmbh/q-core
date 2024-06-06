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
    bulkCreate: <
        Table extends keyof DatabaseSchema & string,
        Row extends DatabaseSchema[Table]
    >(
        table: Table,
        rows: Row[]
    ) => Promise<Row[]>

    bulkRemove: <Table extends keyof DatabaseSchema & string>(
        table: Table,
        ids: ID[]
    ) => Promise<void>

    bulkUpdate: <
        Table extends keyof DatabaseSchema & string,
        Row extends DatabaseSchema[Table]
    >(
        table: Table,
        rows: (Partial<Omit<Row, 'id'>> & DBMeta)[]
    ) => Promise<void>

    create: <
        Table extends keyof DatabaseSchema & string,
        Row extends DatabaseSchema[Table]
    >(
        table: Table,
        data: Row,
        createId?: ID
    ) => Promise<ID>

    find: <
        Table extends keyof DatabaseSchema & string,
        Row extends DatabaseSchema[Table]
    >(
        table: Table,
        id: ID
    ) => Promise<(Row & DBMeta) | undefined>

    query: <
        Table extends keyof DatabaseSchema & string,
        Row extends DatabaseSchema[Table],
        Fields extends (keyof Row & string)[] | undefined
    >(
        table: Table,
        constraints?: Constraints<Row>,
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
        constraints?: Constraints<Row>
    ) => Promise<number>

    remove: <Table extends keyof DatabaseSchema & string>(
        table: Table,
        id: ID
    ) => Promise<void>

    update: <
        Table extends keyof DatabaseSchema & string,
        Row extends DatabaseSchema[Table]
    >(
        table: Table,
        id: ID,
        data: Partial<Row>
    ) => Promise<void>
}
