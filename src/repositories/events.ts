import type {
    DatabaseSchemaTemplate,
    DBMeta,
    Repository
} from '@core/repositories/interface'

export type RepositoryEvent = 'create' | 'update' | 'remove'

export type RepositoryEventListener = (data: DBMeta) => Promise<void>

export type RepositoryEventListeners<
    DatabaseSchema extends DatabaseSchemaTemplate
> = {
    [Evt in RepositoryEvent]?: {
        [Table in keyof DatabaseSchema & string]?: RepositoryEventListener[]
    }
}

export interface RepositoryWithEvents<
    DatabaseSchema extends DatabaseSchemaTemplate
> extends Repository<DatabaseSchema> {
    off: <
        Evt extends RepositoryEvent,
        Table extends keyof DatabaseSchema & string
    >(
        event: Evt,
        table: Table,
        callback?: RepositoryEventListener
    ) => void

    on: <
        Evt extends RepositoryEvent,
        Table extends keyof DatabaseSchema & string
    >(
        event: Evt,
        table: Table,
        callback: RepositoryEventListener
    ) => void
}

export function withEvents<DatabaseSchema extends DatabaseSchemaTemplate>(
    repository: Repository<DatabaseSchema>
): RepositoryWithEvents<DatabaseSchema> {
    const listeners: RepositoryEventListeners<DatabaseSchema> = {}

    async function triggerEvent<
        Evt extends RepositoryEvent,
        Table extends keyof DatabaseSchema & string
    >(event: Evt, table: Table, data: DBMeta) {
        const eventListeners = listeners[event]?.[table]
        if (!eventListeners) {
            return
        }

        for (const listener of eventListeners) {
            try {
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
                await triggerEvent('create', table, { id: row.id })
            }
            return createdRows
        },

        bulkRemove: async (table, ids) => {
            await repository.bulkRemove(table, ids)
            for (const id of ids) {
                await triggerEvent('remove', table, { id })
            }
        },

        bulkUpdate: async (table, rows) => {
            await repository.bulkUpdate(table, rows)
            for (const row of rows) {
                await triggerEvent('update', table, { id: row.id })
            }
        },

        create: async (table, data, createId) => {
            const id = await repository.create(table, data, createId)
            await triggerEvent('create', table, { id, ...data })
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
                listeners[event]![table]!.push(callback)
            }
        },

        remove: async (table, id) => {
            await repository.remove(table, id)
            await triggerEvent('remove', table, { id })
        },

        update: async (table, id, data) => {
            await repository.update(table, id, data)
            await triggerEvent('update', table, { id, ...data })
        }
    } satisfies RepositoryWithEvents<DatabaseSchema>
}
