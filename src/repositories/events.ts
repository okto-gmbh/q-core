import { TableName } from '~core/types/models'

import type { Repository } from '@core/repositories/interface'

type RepositoryEvent = 'beforeRemove' | 'create' | 'remove' | 'update'

type RepositoryEventListeners = {
    [Evt in RepositoryEvent]?: {
        [Table in TableName]?: ((data: unknown) => Promise<void>)[]
    }
}

export interface RepositoryWithEvents extends Repository {
    off: (
        event: RepositoryEvent,
        table: TableName,
        callback?: (data: unknown) => Promise<void>
    ) => void

    on: (
        event: RepositoryEvent,
        table: TableName,
        callback: (data: unknown) => Promise<void>
    ) => void
}

export function withEvents(repository: Repository): RepositoryWithEvents {
    const listeners: RepositoryEventListeners = {}

    async function triggerEvent(event: RepositoryEvent, table: TableName, data: unknown) {
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

    const repositoryWithEvents: RepositoryWithEvents = {
        ...repository,

        bulkCreate: async (table, rows) => {
            const createdRows = await repository.bulkCreate(table, rows)
            for (const row of createdRows) {
                await triggerEvent('create', table, row)
            }
            return createdRows
        },

        bulkRemove: async (table, ids) => {
            for (const id of ids) {
                await triggerEvent('beforeRemove', table, { id })
            }
            await repository.bulkRemove(table, ids)
            for (const id of ids) {
                await triggerEvent('remove', table, { id })
            }
        },

        bulkUpdate: async (table, rows) => {
            await repository.bulkUpdate(table, rows)
            for (const row of rows) {
                await triggerEvent('update', table, row)
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
                listeners[event][table] = listeners[event][table].filter((cb) => cb !== callback)
            } else {
                listeners[event][table].length = 0
            }
        },

        on: (event, table, callback) => {
            listeners[event] ??= {}
            if (!listeners[event]![table]) {
                listeners[event]![table] = [callback]
            } else {
                listeners[event]![table].push(callback)
            }
        },

        remove: async (table, id) => {
            await triggerEvent('beforeRemove', table, { id })
            await repository.remove(table, id)
            await triggerEvent('remove', table, { id })
        },

        update: async (table, id, data) => {
            await repository.update(table, id, data)
            await triggerEvent('update', table, { id, ...data })
        },
    }

    return repositoryWithEvents
}
