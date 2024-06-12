import { FieldValue } from 'firebase-admin/firestore'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import getRepository from '@core/repositories/firestore/admin'
import {
    getMockDB,
    getRawMockData,
    resetMockRepository,
    seedMockRepository,
    verifyMock
} from '@core/repositories/firestore/mock'
import type { DatabaseSchemaTemplate } from '@core/repositories/interface'

type FirebaseMeta<Repository extends DatabaseSchemaTemplate> = {
    [Table in keyof Repository]: {
        [Field in keyof Repository[Table]]:
            | Repository[Table][Field]
            | ReturnType<typeof FieldValue.delete>
    } & {
        __name__?: string
        id?: string
    }
}

type TestRepository = FirebaseMeta<{
    members: {
        name: string
        age?: number | ReturnType<typeof FieldValue.delete>
        id?: string
    }
}>

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

    it('should seed the database', () => {
        seedMockRepository('members', [{ name: 'John' }, { name: 'Jane' }])
        expect(getRawMockData().members['0']).toEqual({ name: 'John' })
        expect(getRawMockData().members['1']).toEqual({ name: 'Jane' })
    })

    it('should reset the database', () => {
        seedMockRepository('members', [{ name: 'John' }, { name: 'Jane' }])
        resetMockRepository()
        expect(getRawMockData()).toEqual({})
    })

    it('should return the id when creating an entry', async () => {
        const db = getMockDB()
        const repo = getRepository<TestRepository>(db)
        const id = await repo.create('members', { name: 'John' })
        expect(id).toBe('0')
    })

    it('should use the createId when provided', async () => {
        const db = getMockDB()
        const repo = getRepository<TestRepository>(db)
        const id = await repo.create('members', { name: 'John' }, '2')
        expect(id).toBe('2')
        expect(Object.keys(getRawMockData().members)[0]).toBe('2')
    })

    it('should reflect the entry in the database after creation', async () => {
        const db = getMockDB()
        const repo = getRepository<TestRepository>(db)
        const id = await repo.create('members', { name: 'John' })

        expect(id).toBe('0')
        expect(Object.keys(getRawMockData().members)).toHaveLength(1)
        expect(getRawMockData().members['0']).toEqual({ name: 'John' })
    })

    it('should bulk add entries into the database', async () => {
        const db = getMockDB()
        const repo = getRepository<TestRepository>(db)
        const members = await repo.bulkCreate('members', [
            { name: 'John' },
            { name: 'Jane' }
        ])

        expect(members).toHaveLength(2)
        expect(Object.keys(getRawMockData().members)).toHaveLength(2)
        expect(getRawMockData().members['0']).toEqual({ name: 'John' })
        expect(getRawMockData().members['1']).toEqual({ name: 'Jane' })
    })

    it('should add the id as a property for entries returned with find', async () => {
        const db = getMockDB()
        const repo = getRepository<TestRepository>(db)

        seedMockRepository('members', [{ name: 'John' }, { name: 'Jane' }])

        const member = await repo.find('members', '0')
        expect(member).toEqual({ id: '0', name: 'John' })
    })

    it('should add the id as a property for entries returned with query', async () => {
        const db = getMockDB()
        const repo = getRepository<TestRepository>(db)

        seedMockRepository('members', [{ name: 'John' }])

        const members = await repo.query('members')
        expect(members).toEqual([{ id: '0', name: 'John' }])
    })

    it('should find the correct entry by id', async () => {
        const db = getMockDB()
        const repo = getRepository<TestRepository>(db)

        seedMockRepository('members', [{ name: 'John' }, { name: 'Jane' }])

        const member1 = await repo.find('members', '0')
        expect(member1).toEqual({ id: '0', name: 'John' })

        const member2 = await repo.find('members', '1')
        expect(member2).toEqual({ id: '1', name: 'Jane' })
    })

    it('should remove the correct entry by id', async () => {
        const db = getMockDB()
        const repo = getRepository<TestRepository>(db)

        seedMockRepository('members', [
            { name: 'John' },
            { name: 'Jane' },
            { name: 'Jack' }
        ])

        await repo.remove('members', '1')

        expect(Object.keys(getRawMockData().members)).toHaveLength(2)
        expect(getRawMockData().members['0']).toEqual({ name: 'John' })
        expect(getRawMockData().members['1']).toBeUndefined()
        expect(getRawMockData().members['2']).toEqual({ name: 'Jack' })
    })

    it('should bulk remove the correct entries', async () => {
        const db = getMockDB()
        const repo = getRepository<TestRepository>(db)

        seedMockRepository('members', [
            { name: 'John' },
            { name: 'Jane' },
            { name: 'Jack' }
        ])

        await repo.bulkRemove('members', ['1', '2'])

        expect(Object.keys(getRawMockData().members)).toHaveLength(1)
        expect(getRawMockData().members['0']).toEqual({ name: 'John' })
        expect(getRawMockData().members['1']).toBeUndefined()
        expect(getRawMockData().members['2']).toBeUndefined()
    })

    it('should update the correct entry by id', async () => {
        const db = getMockDB()
        const repo = getRepository<TestRepository>(db)

        seedMockRepository('members', [
            { name: 'John' },
            { name: 'Jane' },
            { name: 'Jack' }
        ])

        await repo.update('members', '1', { name: 'Jill' })

        expect(Object.keys(getRawMockData().members)).toHaveLength(3)
        expect(getRawMockData().members['0']).toEqual({ name: 'John' })
        expect(getRawMockData().members['1']).toEqual({ name: 'Jill' })
        expect(getRawMockData().members['2']).toEqual({ name: 'Jack' })

        await repo.update('members', '1', { age: 20, name: 'Jill' })

        expect(Object.keys(getRawMockData().members)).toHaveLength(3)
        expect(getRawMockData().members['0']).toEqual({ name: 'John' })
        expect(getRawMockData().members['1']).toEqual({
            age: 20,
            name: 'Jill'
        })
        expect(getRawMockData().members['2']).toEqual({ name: 'Jack' })
    })

    it('should remove entries with the deleteTransform value on update', async () => {
        const db = getMockDB()
        const repo = getRepository<TestRepository>(db)

        seedMockRepository('members', [
            { name: 'John' },
            { age: 20, name: 'Jane' },
            { name: 'Jack' }
        ])

        await repo.update('members', '1', { age: FieldValue.delete() })

        expect(Object.keys(getRawMockData().members)).toHaveLength(3)
        expect(getRawMockData().members['0']).toEqual({ name: 'John' })
        expect(getRawMockData().members['1']).toEqual({ name: 'Jane' })
        expect(getRawMockData().members['2']).toEqual({ name: 'Jack' })
    })

    it('should filter queries by constraints', async () => {
        const db = getMockDB()
        const repo = getRepository<TestRepository>(db)

        seedMockRepository('members', [
            { name: 'John' },
            { age: 20, name: 'Jane' },
            { name: 'Jack' },
            { age: 27, name: 'Jane' }
        ])

        const members = await repo.query('members', {
            where: [['name', '==', 'Jane']]
        })

        expect(members).toEqual([
            { age: 20, id: '1', name: 'Jane' },
            { age: 27, id: '3', name: 'Jane' }
        ])
    })

    it('should reduce query responses to the requested fields', async () => {
        const db = getMockDB()
        const repo = getRepository<TestRepository>(db)

        seedMockRepository('members', [
            { name: 'John' },
            { age: 20, name: 'Jane' },
            { name: 'Jack' },
            { age: 27, name: 'Jane' }
        ])

        const memberIds = await repo.query('members', undefined, ['id'])

        expect(memberIds).toEqual([
            { id: '0' },
            { id: '1' },
            { id: '2' },
            { id: '3' }
        ])

        const memberNames = await repo.query('members', undefined, ['name'])

        expect(memberNames).toEqual([
            { name: 'John' },
            { name: 'Jane' },
            { name: 'Jack' },
            { name: 'Jane' }
        ])
    })

    it('should support __name__ as a constraint', async () => {
        const db = getMockDB()
        const repo = getRepository<TestRepository>(db)

        seedMockRepository('members', [
            { name: 'John' },
            { age: 20, name: 'Jane' },
            { name: 'Jack' },
            { age: 27, name: 'Jane' }
        ])

        const members = await repo.query('members', {
            where: [['__name__', '==', '1']]
        })

        expect(members).toEqual([{ age: 20, id: '1', name: 'Jane' }])
    })

    it('should support __name__ for ordering', async () => {
        const db = getMockDB()
        const repo = getRepository<TestRepository>(db)

        seedMockRepository('members', [
            { name: 'John' },
            { age: 20, name: 'Jane' },
            { name: 'Jack' },
            { age: 27, name: 'Jane' }
        ])

        const members = await repo.query('members', {
            orderBy: { __name__: 'desc' }
        })

        expect(members).toEqual([
            { age: 27, id: '3', name: 'Jane' },
            { id: '2', name: 'Jack' },
            { age: 20, id: '1', name: 'Jane' },
            { id: '0', name: 'John' }
        ])
    })

    it('should AND multiple query constraints together', async () => {
        const db = getMockDB()
        const repo = getRepository<TestRepository>(db)

        seedMockRepository('members', [
            { name: 'John' },
            { age: 20, name: 'Jane' },
            { name: 'Jack' },
            { age: 27, name: 'Jane' }
        ])

        const members = await repo.query('members', {
            where: [
                ['name', '==', 'Jane'],
                ['age', '>=', 25]
            ]
        })

        expect(members).toEqual([{ age: 27, id: '3', name: 'Jane' }])
    })

    it('should be possible to limit the amount of rows returned by query', async () => {
        const db = getMockDB()
        const repo = getRepository<TestRepository>(db)

        seedMockRepository('members', [
            { name: 'John' },
            { age: 20, name: 'Jane' },
            { name: 'Jack' },
            { age: 27, name: 'Jane' }
        ])

        const members = await repo.query('members', {
            limit: 2
        })

        expect(members).toEqual([
            { id: '0', name: 'John' },
            { age: 20, id: '1', name: 'Jane' }
        ])
    })

    it('should return only requested query fields', async () => {
        const db = getMockDB()
        const repo = getRepository<TestRepository>(db)

        seedMockRepository('members', [
            { name: 'John' },
            { age: 20, name: 'Jane' },
            { name: 'Jack' },
            { age: 27, name: 'Jane' }
        ])

        const members = await repo.query('members', undefined, ['name'])

        expect(members).toEqual([
            { name: 'John' },
            { name: 'Jane' },
            { name: 'Jack' },
            { name: 'Jane' }
        ])
    })

    it('should return correct count for queryCount', async () => {
        const db = getMockDB()
        const repo = getRepository<TestRepository>(db)

        const mockMembers = [
            { name: 'John' },
            { age: 20, name: 'Jane' },
            { name: 'Jack' },
            { age: 27, name: 'Jane' }
        ]
        seedMockRepository('members', mockMembers)

        const members = await repo.queryCount('members')

        expect(members).toEqual(mockMembers.length)
    })
})
