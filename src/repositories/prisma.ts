import { Prisma, PrismaClient } from '@prisma/client'

import { RepositoryWithEvents, withEvents } from '@core/repositories/events'
import { Operators } from '@core/repositories/interface'
import {
    OP_CONTAINS,
    OP_CONTAINS_ANY,
    OP_EQUALS,
    OP_GT,
    OP_GT_OR_EQUALS,
    OP_IN,
    OP_LT,
    OP_LT_OR_EQUALS,
    OP_NOT_EQUALS,
    OP_NOT_IN,
} from '@core/repositories/operators'

const singularTableNames: { [tableName: string]: Uncapitalize<Prisma.ModelName> } = {
    budgets: 'budget',
    changes: 'change',
    comments: 'comment',
    contracts: 'contract',
    customers: 'customer',
    devices: 'device',
    domains: 'domain',
    employees: 'employee',
    firewallLists: 'firewallList',
    firewalls: 'firewall',
    hardware: 'hardware',
    hardwareLists: 'hardwareList',
    inboxes: 'inbox',
    internalNumbers: 'internalNumber',
    internetConnections: 'internetConnection',
    ipAddresses: 'ipAddress',
    licenses: 'license',
    lists: 'list',
    locations: 'location',
    networks: 'network',
    numberBlocks: 'numberBlock',
    partners: 'partner',
    productLists: 'productList',
    products: 'product',
    projects: 'project',
    roles: 'role',
    rooms: 'room',
    sessions: 'session',
    software: 'software',
    softwareLists: 'softwareList',
    tasks: 'task',
    tenants: 'tenant',
    tokens: 'token',
    users: 'user',
    virtualServerLists: 'virtualServerList',
    virtualServers: 'virtualServer',
    workplaces: 'workplace',
}

const mapWhere = ([field, operation, value]: [string, Operators, any]) => {
    switch (operation) {
        case OP_CONTAINS:
            return {
                [field]: {
                    contains: value,
                    mode: 'insensitive',
                },
            }
        case OP_CONTAINS_ANY:
            return {
                [field]: {
                    in: value,
                },
            }
        case OP_EQUALS:
            return {
                [field]: value,
            }
        case OP_GT:
            return {
                [field]: {
                    gt: value,
                },
            }
        case OP_GT_OR_EQUALS:
            return {
                [field]: {
                    gte: value,
                },
            }
        case OP_LT:
            return {
                [field]: {
                    lt: value,
                },
            }
        case OP_IN:
            return {
                [field]: {
                    in: value,
                },
            }
        case OP_NOT_EQUALS:
            return {
                [field]: {
                    not: value,
                },
            }
        case OP_LT_OR_EQUALS:
            return {
                [field]: {
                    lte: value,
                },
            }
        case OP_NOT_IN:
            return {
                [field]: {
                    notIn: value,
                },
            }
        default:
            throw new Error(`Unsupported operation: ${operation}`)
    }
}

const getRepository = (db: PrismaClient): RepositoryWithEvents =>
    withEvents({
        bulkCreate: async (table, rows) => {
            // createMany doesn't support relations, so we need to loop through the rows and create
            const rowArray = Array.isArray(rows) ? rows : [rows]
            return Promise.all(
                rowArray.map((row) =>
                    db[singularTableNames[table]].create({
                        data: row,
                    })
                )
            )
        },

        bulkRemove: async (table, ids) => {
            await db[singularTableNames[table]].deleteMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
            })
        },

        bulkUpdate: async (table, rows) => {
            await db.$transaction(
                rows.map((row) =>
                    db[singularTableNames[table]].update({
                        data: row,
                        where: { id: row.id },
                    })
                )
            )
        },

        create: async (table, data, createId?) => {
            const result = await db[singularTableNames[table]].create({
                data: {
                    ...data,
                    id: createId,
                },
            })

            return result.id
        },

        find: async (table, id, include) => {
            if (!id) {
                return
            }

            return await db[singularTableNames[table]].findUnique({
                include,
                where: { id },
            })
        },

        query: async (table, constraints = {}, fieldsOrInclude?) => {
            const { limit, orderBy: initialOrderBy, where: initialWhere } = constraints

            const where = initialWhere
                ? initialWhere.map(mapWhere).reduce((acc, condition) => {
                      return { ...acc, ...condition }
                  }, {})
                : undefined
            const orderBy = initialOrderBy
                ? Object.entries(initialOrderBy).map(([field, direction = 'asc']) => ({
                      [field]: direction,
                  }))
                : undefined

            const select =
                typeof fieldsOrInclude === 'object' && Array.isArray(fieldsOrInclude)
                    ? fieldsOrInclude.reduce(
                          (acc, field) => {
                              acc[field as string] = true
                              return acc
                          },
                          {} as Record<string, boolean>
                      )
                    : typeof fieldsOrInclude === 'object' && !Array.isArray(fieldsOrInclude)
                      ? fieldsOrInclude
                      : undefined

            return await db[singularTableNames[table]].findMany({
                orderBy,
                select,
                take: limit,
                where,
            })
        },

        queryCount: async (table, constraints = {}) => {
            const { where } = constraints

            return await db[singularTableNames[table]].count({
                where: where
                    ? where.map(mapWhere).reduce((acc, condition) => {
                          return { ...acc, ...condition }
                      }, {})
                    : undefined,
            })
        },

        remove: async (table, id) => {
            await db[singularTableNames[table]].delete({
                where: { id },
            })
        },

        update: async (table, id, data) => {
            console.dir({ action: 'update', data }, { depth: null })
            await db[singularTableNames[table]].update({
                data,
                where: { id },
            })
        },
    })

export default getRepository
