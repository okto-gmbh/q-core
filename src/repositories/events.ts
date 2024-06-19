import type {
    DatabaseSchemaTemplate,
    DBMeta,
    Repository
} from '@core/repositories/interface'

type RepositoryEvent = 'create' | 'update' | 'remove' 
type RepositoryBulkEvent = 'bulkCreate' | 'bulkUpdate' | 'bulkRemove'

const REPOSITORY_EVENT_MAP = {
    create: "create",
    remove: "remove",
    update: "update",
    bulkCreate: "create",
    bulkRemove: "remove",
    bulkUpdate: "update"
} as const satisfies Record<RepositoryEvent | RepositoryBulkEvent, RepositoryEvent>

type RepositoryEventListeners<DatabaseSchema extends DatabaseSchemaTemplate> = {
    [Evt in RepositoryEvent]?: {
        [Table in keyof DatabaseSchema & string]?: ((
            data: RepositoryEventDataTypeMap<DatabaseSchema, Table>[Evt]
        ) => Promise<void>)[]
    }
}

type RepositoryEventDataTypeMap<
    DatabaseSchema extends DatabaseSchemaTemplate,
    Table extends keyof DatabaseSchema & string
> = {
    create: DatabaseSchema[Table] & DBMeta
    update: Partial<DatabaseSchema[Table]> & DBMeta
    remove: DBMeta
    bulkCreate: DBMeta
    bulkUpdate: DBMeta
    bulkRemove: DBMeta
}

export interface RepositoryWithEvents<
    DatabaseSchema extends DatabaseSchemaTemplate
> extends Repository<DatabaseSchema> {
    off: <
        const Evt extends RepositoryEvent,
        const Table extends keyof DatabaseSchema & string
    >(
        event: Evt,
        table: Table,
        callback?: (
            data: RepositoryEventDataTypeMap<DatabaseSchema, Table>[Evt]
        ) => Promise<void>
    ) => void

    on: <
        const Evt extends RepositoryEvent,
        const Table extends keyof DatabaseSchema & string
    >(
        event: Evt,
        table: Table,
        callback: (
            data: RepositoryEventDataTypeMap<DatabaseSchema, Table>[Evt]
        ) => Promise<void>
    ) => void
}

export function withEvents<DatabaseSchema extends DatabaseSchemaTemplate>(
    repository: Repository<DatabaseSchema>
): RepositoryWithEvents<DatabaseSchema> {
    const listeners: RepositoryEventListeners<DatabaseSchema> = {}

    async function triggerEvent<
        const Evt extends RepositoryEvent | RepositoryBulkEvent,
        const Table extends keyof DatabaseSchema & string
    >(
        event: Evt,
        table: Table,
        data: RepositoryEventDataTypeMap<DatabaseSchema, Table>[Evt]
    ) {
        const eventName = REPOSITORY_EVENT_MAP[event]

        const eventListeners = listeners[eventName]?.[table]
        
        if (!eventListeners) {
            return
        }

        for (const listener of eventListeners) {
            try {
                // @ts-expect-error
                await listener(data)
            } catch (error) {
                console.error(`Error in event listener ${event}`, error)
            }
        }
    }

    return {
        ...repository,

        bulkCreate: async (table, rows) => {
            const createdRows = await repository.bulkCreate(table, rows)
            for (const row of createdRows) {
                await triggerEvent("bulkCreate", table, {
                    id: row.id
                })
            }
            return createdRows
        },

        bulkRemove: async (table, ids) => {
            await repository.bulkRemove(table, ids)
            for (const id of ids) {
                await triggerEvent("bulkRemove", table, { id })
            }
        },

        bulkUpdate: async (table, rows) => {
            await repository.bulkUpdate(table, rows)
            for (const row of rows) {
                await triggerEvent("bulkUpdate", table, {
                    id: row.id
                })
            }
        },

        create: async (table, data, createId) => {
            const id = await repository.create(table, data, createId)
            await triggerEvent("create", table, { id, ...data })
            return id
        },

        off: (event, table, callback?) => {
            if (!listeners[event]?.[table]) {
                return
            }

            if (callback) {
                // @ts-expect-error
                listeners[event]![table] = listeners[event]![table]!.filter(
                    (cb) => cb !== callback
                )
            } else {
                listeners[event]![table]!.length = 0
            }
        },

        on: (event, table, callback) => {
            listeners[event] ??= {}
            if (!listeners[event]![table]) {
                // @ts-expect-error
                listeners[event]![table] = [callback]
            } else {
                // @ts-expect-error
                listeners[event]![table]!.push(callback)
            }
        },

        remove: async (table, id) => {
            await repository.remove(table, id)
            await triggerEvent("remove", table, { id })
        },

        update: async (table, id, data) => {
            await repository.update(table, id, data)
            await triggerEvent("update", table, { id, ...data })
        }
    } satisfies RepositoryWithEvents<DatabaseSchema>
}
