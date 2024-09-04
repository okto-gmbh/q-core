import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import getRepository from '@core/repositories/firestore/admin'
import {
    getMockDB,
    resetMockRepository,
    seedMockRepository,
    verifyMock,
} from '@core/repositories/firestore/mock'

type TestRepository = {
    members: {
        name: string
        age?: number
        id?: string
    }
}

describe('firestore', () => {
    beforeAll(() => {
        vi.mock(
            '@core/repositories/firestore/admin',
            () => import('@core/repositories/firestore/mock')
        )

        const spy = vi.spyOn(verifyMock, 'verifyMock')
        getRepository(getMockDB())
        expect(spy).toHaveBeenCalled()
        resetMockRepository()

        return () => {
            vi.restoreAllMocks()
        }
    })

    afterEach(() => {
        resetMockRepository()
    })

    it('should mock the database', async () => {
        const spy = vi.spyOn(verifyMock, 'verifyMock')

        const db = getMockDB()
        getRepository(db)

        expect(spy).toHaveBeenCalled()
    })

    describe('events', () => {
        it('should trigger the "create" event when creating an entry', async () => {
            const db = getMockDB()
            const repo = getRepository<TestRepository>(db)

            const memberListener = {
                callback: async () => {},
            }

            const memberSpy = vi.spyOn(memberListener, 'callback')

            repo.on('create', 'members', memberListener.callback)

            await repo.create('members', { name: 'John' })

            expect(memberSpy).toHaveBeenCalledTimes(1)
            expect(memberSpy).toHaveBeenCalledWith({
                id: '0',
                name: 'John',
            })

            await repo.create('members', { age: 20, name: 'Jane' })

            expect(memberSpy).toHaveBeenCalledTimes(2)
            expect(memberSpy).toHaveBeenCalledWith({
                age: 20,
                id: '1',
                name: 'Jane',
            })
        })

        it('should trigger the "update" event when updating an entry', async () => {
            const db = getMockDB()
            const repo = getRepository<TestRepository>(db)

            seedMockRepository('members', [{ name: 'John' }, { name: 'Jane' }, { name: 'Jack' }])
            const memberListener = {
                callback: async () => {},
            }

            const memberSpy = vi.spyOn(memberListener, 'callback')

            repo.on('update', 'members', memberListener.callback)

            await repo.update('members', '1', { name: 'Jill' })

            expect(memberSpy).toHaveBeenCalledTimes(1)
            expect(memberSpy).toHaveBeenCalledWith({
                id: '1',
                name: 'Jill',
            })

            await repo.update('members', '1', { age: 20, name: 'Jill' })

            expect(memberSpy).toHaveBeenCalledTimes(2)
            expect(memberSpy).toHaveBeenCalledWith({
                age: 20,
                id: '1',
                name: 'Jill',
            })
        })

        it('should trigger the "remove" event when removing an entry', async () => {
            const db = getMockDB()
            const repo = getRepository<TestRepository>(db)

            seedMockRepository('members', [{ name: 'John' }, { name: 'Jane' }, { name: 'Jack' }])
            const memberListener = {
                callback: async () => {},
            }

            const memberSpy = vi.spyOn(memberListener, 'callback')

            repo.on('remove', 'members', memberListener.callback)

            await repo.remove('members', '1')

            expect(memberSpy).toHaveBeenCalledTimes(1)
            expect(memberSpy).toHaveBeenCalledWith({ id: '1' })

            await repo.remove('members', '2')

            expect(memberSpy).toHaveBeenCalledTimes(2)
            expect(memberSpy).toHaveBeenCalledWith({
                id: '2',
            })
        })

        it('should not trigger other events', async () => {
            const db = getMockDB()
            const repo = getRepository<TestRepository>(db)

            const memberListener = {
                createCallback: async () => {},
                removeCallback: async () => {},
                updateCallback: async () => {},
            }

            const createSpy = vi.spyOn(memberListener, 'createCallback')
            const updateSpy = vi.spyOn(memberListener, 'updateCallback')
            const removeSpy = vi.spyOn(memberListener, 'removeCallback')

            repo.on('create', 'members', memberListener.createCallback)
            repo.on('update', 'members', memberListener.updateCallback)
            repo.on('remove', 'members', memberListener.removeCallback)

            await repo.create('members', { name: 'John' })

            expect(createSpy).toHaveBeenCalledTimes(1)
            expect(updateSpy).not.toHaveBeenCalled()
            expect(removeSpy).not.toHaveBeenCalled()

            await repo.update('members', '0', { name: 'Jane' })

            expect(createSpy).toHaveBeenCalledTimes(1)
            expect(updateSpy).toHaveBeenCalledTimes(1)
            expect(removeSpy).not.toHaveBeenCalled()

            await repo.remove('members', '0')

            expect(createSpy).toHaveBeenCalledTimes(1)
            expect(updateSpy).toHaveBeenCalledTimes(1)
            expect(removeSpy).toHaveBeenCalledTimes(1)
        })

        it('should not trigger events of other tables', async () => {
            const db = getMockDB()
            const repo = getRepository<TestRepository>(db)

            seedMockRepository('members', [{ name: 'John' }])
            seedMockRepository('users', [{ name: 'John' }])

            const memberListener = {
                callback: async () => {},
            }

            const userListener = {
                callback: async () => {},
            }

            const memberSpy = vi.spyOn(memberListener, 'callback')
            const userSpy = vi.spyOn(userListener, 'callback')

            repo.on('update', 'members', memberListener.callback)

            await repo.update('members', '0', { name: 'Jane' })

            expect(memberSpy).toHaveBeenCalledTimes(1)
            expect(userSpy).not.toHaveBeenCalled()
        })

        it('should return the data anyways, even if the listener function throws', async () => {
            const db = getMockDB()
            const repo = getRepository<TestRepository>(db)

            const memberListener = {
                callback: async () => {
                    throw new Error('Error in listener')
                },
            }

            const memberSpy = vi.spyOn(memberListener, 'callback')

            repo.on('create', 'members', memberListener.callback)

            const id = await repo.create('members', { name: 'Jane' })

            expect(id).toBe('0')
            expect(memberSpy).toHaveBeenCalledTimes(1)
        })

        it('should be possible to register multiple listeners', async () => {
            const db = getMockDB()
            const repo = getRepository<TestRepository>(db)

            seedMockRepository('members', [{ name: 'John' }])
            const memberListener1 = {
                callback: async () => {},
            }
            const memberListener2 = {
                callback: async () => {},
            }

            const memberSpy1 = vi.spyOn(memberListener1, 'callback')
            const memberSpy2 = vi.spyOn(memberListener2, 'callback')

            repo.on('update', 'members', memberListener1.callback)
            repo.on('update', 'members', memberListener2.callback)

            await repo.update('members', '0', { name: 'Jane' })

            expect(memberSpy1).toHaveBeenCalledTimes(1)
            expect(memberSpy2).toHaveBeenCalledTimes(1)
        })

        it('should be possible to unregister a single listener', async () => {
            const db = getMockDB()
            const repo = getRepository<TestRepository>(db)

            seedMockRepository('members', [{ name: 'John' }])
            const memberListener1 = {
                callback: async () => {},
            }
            const memberListener2 = {
                callback: async () => {},
            }

            const memberSpy1 = vi.spyOn(memberListener1, 'callback')
            const memberSpy2 = vi.spyOn(memberListener2, 'callback')

            repo.on('update', 'members', memberListener1.callback)
            repo.on('update', 'members', memberListener2.callback)

            await repo.update('members', '0', { name: 'Jane' })

            expect(memberSpy1).toHaveBeenCalledTimes(1)
            expect(memberSpy2).toHaveBeenCalledTimes(1)

            repo.off('update', 'members', memberListener1.callback)

            await repo.update('members', '0', { age: 20, name: 'Jill' })

            expect(memberSpy1).toHaveBeenCalledTimes(1)
            expect(memberSpy2).toHaveBeenCalledTimes(2)

            repo.off('update', 'members', memberListener2.callback)

            expect(memberSpy1).toHaveBeenCalledTimes(1)
            expect(memberSpy2).toHaveBeenCalledTimes(2)
        })

        it('should be possible to unregister all listeners', async () => {
            const db = getMockDB()
            const repo = getRepository<TestRepository>(db)

            seedMockRepository('members', [{ name: 'John' }])

            const memberListener1 = {
                callback: async () => {},
            }
            const memberListener2 = {
                callback: async () => {},
            }

            const memberSpy1 = vi.spyOn(memberListener1, 'callback')
            const memberSpy2 = vi.spyOn(memberListener2, 'callback')

            repo.on('update', 'members', memberListener1.callback)
            repo.on('update', 'members', memberListener2.callback)

            await repo.update('members', '0', { name: 'Jane' })

            expect(memberSpy1).toHaveBeenCalledTimes(1)
            expect(memberSpy2).toHaveBeenCalledTimes(1)

            repo.off('update', 'members')

            await repo.update('members', '0', { age: 20, name: 'Jill' })

            expect(memberSpy1).toHaveBeenCalledTimes(1)
            expect(memberSpy2).toHaveBeenCalledTimes(1)
        })

        it('should trigger the "create" event for each row after a bulkCreate', async () => {
            const db = getMockDB()
            const repo = getRepository<TestRepository>(db)

            const memberListener = {
                callback: async () => {},
            }

            const memberSpy = vi.spyOn(memberListener, 'callback')

            repo.on('create', 'members', memberListener.callback)

            await repo.bulkCreate('members', [{ name: 'John' }, { name: 'Jane' }])

            expect(memberSpy).toHaveBeenCalledTimes(2)
            expect(memberSpy).toHaveBeenNthCalledWith(1, {
                id: '0',
                name: 'John',
            })
            expect(memberSpy).toHaveBeenNthCalledWith(2, {
                id: '1',
                name: 'Jane',
            })
        })

        it('should trigger the "update" event for each row after a bulkUpdate', async () => {
            const db = getMockDB()
            const repo = getRepository<TestRepository>(db)

            seedMockRepository('members', [{ name: 'John' }, { name: 'Jane' }, { name: 'Jack' }])

            const memberListener = {
                callback: async () => {},
            }

            const memberSpy = vi.spyOn(memberListener, 'callback')

            repo.on('update', 'members', memberListener.callback)

            await repo.bulkUpdate('members', [
                { id: '0', name: 'Jill' },
                { id: '1', name: 'James' },
            ])

            expect(memberSpy).toHaveBeenCalledTimes(2)
            expect(memberSpy).toHaveBeenNthCalledWith(1, {
                id: '0',
                name: 'Jill',
            })
            expect(memberSpy).toHaveBeenNthCalledWith(2, {
                id: '1',
                name: 'James',
            })
        })

        it('should trigger the "remove" event for each row after a bulkRemove', async () => {
            const db = getMockDB()
            const repo = getRepository<TestRepository>(db)

            seedMockRepository('members', [{ name: 'John' }, { name: 'Jane' }, { name: 'Jack' }])

            const memberListener = {
                callback: async () => {},
            }

            const memberSpy = vi.spyOn(memberListener, 'callback')

            repo.on('remove', 'members', memberListener.callback)

            await repo.bulkRemove('members', ['1', '2'])

            expect(memberSpy).toHaveBeenCalledTimes(2)
            expect(memberSpy).toHaveBeenNthCalledWith(1, { id: '1' })
            expect(memberSpy).toHaveBeenNthCalledWith(2, { id: '2' })
        })

        it('should still return all data, even if some of the listeners throw an error', async () => {
            const db = getMockDB()
            const repo = getRepository<TestRepository>(db)

            const memberListener = {
                callback: async () => {
                    throw new Error('Error in listener')
                },
            }

            const memberSpy = vi.spyOn(memberListener, 'callback')

            repo.on('create', 'members', memberListener.callback)

            const createdIds = await repo.bulkCreate('members', [
                { name: 'John' },
                { name: 'Jane' },
                { name: 'Jack' },
            ])

            expect(memberSpy).toHaveBeenCalledTimes(3)
            expect(createdIds).toEqual([
                {
                    id: '0',
                    name: 'John',
                },
                {
                    id: '1',
                    name: 'Jane',
                },
                {
                    id: '2',
                    name: 'Jack',
                },
            ])
        })
    })
})
