import type {
    Entity,
    Repository,
    RepositoryEvent,
    RepositoryEventListener,
    RepositoryEventListeners,
    Table
} from '@core/repositories/interface'

export interface RepositoryWithEvents extends Repository {
    off: <Row extends Entity>(
        event: RepositoryEvent,
        table: Table,
        callback?: RepositoryEventListener<Row>
    ) => void

    on: <Row extends Entity>(
        event: RepositoryEvent,
        table: Table,
        callback: RepositoryEventListener<Row>
    ) => void
}

export function withEvents(repository: Repository): RepositoryWithEvents {
    const listeners: RepositoryEventListeners = {}

    const triggerEvent = async (
        event: RepositoryEvent,
        table: Table,
        data: Entity
    ) => {
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
                await triggerEvent('create', table, row)
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
                await triggerEvent('update', table, row)
            }
        },

        create: async (table, data, createId) => {
            const id = await repository.create(table, data, createId)
            await triggerEvent('create', table, { id, ...data })
            return id
        },

        off: <Row extends Entity>(
            event: RepositoryEvent,
            table: Table,
            callback?: RepositoryEventListener<Row>
        ) => {
            if (!listeners[event]?.[table]) {
                return
            }

            if (callback) {
                listeners[event][table] = listeners[event][table].filter(
                    (cb) => cb !== callback
                )
            } else {
                listeners[event][table] = []
            }
        },

        on: <Row extends Entity>(
            event: RepositoryEvent,
            table: Table,
            callback: RepositoryEventListener<Row>
        ) => {
            listeners[event] ??= {}
            listeners[event]![table] ??= []
            listeners[event]![table]!.push(callback)
        },

        remove: async (table, id) => {
            await repository.remove(table, id)
            await triggerEvent('remove', table, { id })
        },

        update: async (table, id, data) => {
            await repository.update(table, id, data)
            await triggerEvent('update', table, { id, ...data })
        }
    } satisfies RepositoryWithEvents
}
