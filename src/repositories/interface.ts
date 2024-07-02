import type * as operators from './operators'

export type ID = string
export type DBMeta = { id: ID }
export type RowTemplate = { [field: string]: any }
export type DatabaseSchemaTypes = {
    all: RowTemplate
    create: RowTemplate
    partial: Partial<RowTemplate>
}
export type DatabaseSchemaTemplate = {
    [table: string]: DatabaseSchemaTypes
}
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
        rows: DatabaseSchema[Table]['create'][]
    ) => Promise<DatabaseSchema[Table]['all'][]>

    bulkRemove: <Table extends keyof DatabaseSchema & string>(
        table: Table,
        ids: ID[]
    ) => Promise<void>

    bulkUpdate: <Table extends keyof DatabaseSchema & string>(
        table: Table,
        rows: (DatabaseSchema[Table]['partial'] & DBMeta)[]
    ) => Promise<void>

    create: <Table extends keyof DatabaseSchema & string>(
        table: Table,
        data: DatabaseSchema[Table]['create'],
        createId?: ID
    ) => Promise<ID>

    find: <Table extends keyof DatabaseSchema & string>(
        table: Table,
        id: ID
    ) => Promise<DatabaseSchema[Table]['all'] | undefined>

    query: <
        Table extends keyof DatabaseSchema & string,
        Fields extends
            | (keyof DatabaseSchema[Table]['all'] & string)[]
            | undefined
    >(
        table: Table,
        constraints?: Constraints<DatabaseSchema[Table]['all']>,
        fields?: Fields
    ) => Promise<
        Fields extends string[]
            ? Pick<DatabaseSchema[Table]['all'], Fields[number]>[]
            : DatabaseSchema[Table]['all'][]
    >

    queryCount: <Table extends keyof DatabaseSchema & string>(
        table: Table,
        constraints?: Constraints<DatabaseSchema[Table]['all']>
    ) => Promise<number>

    remove: <Table extends keyof DatabaseSchema & string>(
        table: Table,
        id: ID
    ) => Promise<void>

    update: <Table extends keyof DatabaseSchema & string>(
        table: Table,
        id: ID,
        data: DatabaseSchema[Table]['partial']
    ) => Promise<void>
}
