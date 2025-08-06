import { Prisma, PrismaClient } from '@prisma/client'

import { Operation } from 'okto-core/db/types/prisma'

import { GetModelByTableName, ModelName, TableName } from '~core/types/entity-types'

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

export interface Constraints<Table extends Prisma.ModelName> {
    limit?: number
    orderBy?: {
        [key in GetModelFields<Table>]?: 'asc' | 'desc'
    }
    where?: [GetModelFields<Table>, Operators, any][]
}

export type GetIncludesFromFields<
    Model extends ModelName,
    Fields extends GetModelFields<Model>[],
> = {
    [Field in Fields[number]]: {
        select: { [Key in Field]: true }
    }
}

export type GetModelReturnType<
    Model extends Prisma.ModelName,
    Method extends Operation,
    Options extends {},
> = Prisma.Result<PrismaClient[Uncapitalize<Model>], Options, Method>

export type GetModelOperationArgs<
    Model extends Prisma.ModelName,
    Method extends Operation,
> = Prisma.Args<PrismaClient[Uncapitalize<Model>], Method>

export type GetModelFields<Model extends Prisma.ModelName> = keyof GetModelOperationArgs<
    Model,
    'update'
>['data']

export const tableNameModelMap = {
    budgets: 'Budget',
    changes: 'Change',
    comments: 'Comment',
    contracts: 'Contract',
    customers: 'Customer',
    devices: 'Device',
    domains: 'Domain',
    employees: 'Employee',
    firewallLists: 'FirewallList',
    firewalls: 'Firewall',
    hardware: 'Hardware',
    hardwareLists: 'HardwareList',
    inboxes: 'Inbox',
    internalNumbers: 'InternalNumber',
    internetConnections: 'InternetConnection',
    ipAddresses: 'IpAddress',
    licenses: 'License',
    lists: 'List',
    locations: 'Location',
    networks: 'Network',
    numberBlocks: 'NumberBlock',
    partners: 'Partner',
    productLists: 'ProductList',
    products: 'Product',
    projects: 'Project',
    roles: 'Role',
    rooms: 'Room',
    sessions: 'Session',
    software: 'Software',
    softwareLists: 'SoftwareList',
    tasks: 'Task',
    tenants: 'Tenant',
    tokens: 'Token',
    users: 'User',
    virtualServerLists: 'VirtualServerList',
    virtualServers: 'VirtualServer',
    workplaces: 'Workplace',
} satisfies { [tableName: string]: Prisma.ModelName }

export interface Repository {
    bulkCreate: <
        Table extends TableName,
        Options extends GetModelOperationArgs<Model, 'createManyAndReturn'>,
        Model extends ModelName = GetModelByTableName<Table>,
    >(
        table: Table,
        rows: GetModelOperationArgs<Model, 'createManyAndReturn'>['data']
    ) => Promise<GetModelReturnType<Model, 'createManyAndReturn', Options>>

    bulkRemove: <Table extends TableName>(table: Table, ids: ID[]) => Promise<void>

    bulkUpdate: <Table extends TableName, Model extends ModelName = GetModelByTableName<Table>>(
        table: Table,
        rows: GetModelOperationArgs<Model, 'updateMany'>['data']
    ) => Promise<void>

    create: <Table extends TableName, Model extends ModelName = GetModelByTableName<Table>>(
        table: Table,
        data: GetModelOperationArgs<Model, 'create'>['data'],
        createId?: ID
    ) => Promise<ID>

    find: <
        const Table extends TableName,
        const Includes extends GetModelOperationArgs<Model, 'findUnique'>['include'],
        const Model extends ModelName = GetModelByTableName<Table>,
    >(
        table: Table,
        id: ID,
        include: Includes
    ) => Promise<GetModelReturnType<Model, 'findUnique', { include: Includes }>>

    query: <
        Table extends TableName,
        Includes extends GetModelOperationArgs<Model, 'findUnique'>['include'],
        Fields extends GetModelFields<Model>[],
        FieldsOrIncludes extends Fields | Includes,
        Model extends ModelName = GetModelByTableName<Table>,
    >(
        table: Table,
        constraints?: Constraints<Model>,
        fieldsOrInclude?: FieldsOrIncludes
    ) => Promise<
        GetModelReturnType<
            Model,
            'findMany',
            { include: Includes extends object ? Includes : GetIncludesFromFields<Model, Fields> }
        >
    >

    queryCount: <Table extends TableName, Model extends ModelName = GetModelByTableName<Table>>(
        table: Table,
        constraints?: Constraints<Model>
    ) => Promise<number>

    remove: <Table extends TableName>(table: Table, id: ID) => Promise<void>

    update: <Table extends TableName, Model extends ModelName = GetModelByTableName<Table>>(
        table: Table,
        id: ID,
        data: GetModelOperationArgs<Model, 'update'>['data']
    ) => Promise<void>
}
