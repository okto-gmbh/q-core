// eslint-disable-next-line simple-import-sort/imports
import {
    afterAll,
    afterEach,
    beforeAll,
    describe,
    expect,
    it,
    vi
} from 'vitest'

import { getDB, mock, raw, reset, seed, verifyMock } from './firestore'
import getRepository from '@core/repositories/firestore/admin'

interface Member {
    name: string
    age?: number
}

type Members = Member[]

describe('firestore', () => {
    beforeAll(() => {
        mock()
    })

    afterEach(() => {
        reset()
    })

    afterAll(() => {
        vi.restoreAllMocks()
    })

    it('should mock the database', async () => {
        mock()

        const spy = vi.spyOn(verifyMock, 'verifyMock')

        const db = getDB()
        getRepository(db)

        expect(spy).toHaveBeenCalled()
    })

    it('should seed the database', () => {
        seed('members', [{ name: 'John' }, { name: 'Jane' }])
        expect(raw().members['0']).toEqual({ name: 'John' })
        expect(raw().members['1']).toEqual({ name: 'Jane' })
    })

    it('should reset the database', () => {
        seed('members', [{ name: 'John' }, { name: 'Jane' }])
        reset()
        expect(raw()).toEqual({})
    })

    it('should return the id when creating an entry', async () => {
        const db = getDB()
        const repo = getRepository(db)
        const id = await repo.create('members', { name: 'John' })
        expect(id).toEqual('0')
    })

    it('should reflect the entry in the database after creation', async () => {
        const db = getDB()
        const repo = getRepository(db)
        const id = await repo.create('members', { name: 'John' })

        expect(id).toEqual('0')
        expect(Object.keys(raw().members).length).toEqual(1)
        expect(raw().members['0']).toEqual({ name: 'John' })
    })

    it('should find the correct entry by id', async () => {
        const db = getDB()
        const repo = getRepository(db)

        seed('members', [{ name: 'John' }, { name: 'Jane' }])

        const member1 = await repo.find('members', '0')
        expect(member1).toEqual({ name: 'John' })

        const member2 = await repo.find('members', '1')
        expect(member2).toEqual({ name: 'Jane' })
    })

    it('should remove the correct entry by id', async () => {
        const db = getDB()
        const repo = getRepository(db)

        seed('members', [{ name: 'John' }, { name: 'Jane' }, { name: 'Jack' }])

        await repo.remove('members', '1')

        expect(Object.keys(raw().members).length).toEqual(2)
        expect(raw().members['0']).toEqual({ name: 'John' })
        expect(raw().members['1']).toBeUndefined()
        expect(raw().members['2']).toEqual({ name: 'Jack' })
    })

    it('should update the correct entry by id', async () => {
        const db = getDB()
        const repo = getRepository(db)

        seed('members', [{ name: 'John' }, { name: 'Jane' }, { name: 'Jack' }])

        await repo.update('members', '1', { name: 'Jill' })

        expect(Object.keys(raw().members).length).toEqual(3)
        expect(raw().members['0']).toEqual({ name: 'John' })
        expect(raw().members['1']).toEqual({ name: 'Jill' })
        expect(raw().members['2']).toEqual({ name: 'Jack' })

        await repo.update('members', '1', { age: 20, name: 'Jill' })

        expect(Object.keys(raw().members).length).toEqual(3)
        expect(raw().members['0']).toEqual({ name: 'John' })
        expect(raw().members['1']).toEqual({ age: 20, name: 'Jill' })
        expect(raw().members['2']).toEqual({ name: 'Jack' })
    })

    it('should filter queries by constraints', async () => {
        const db = getDB()
        const repo = getRepository(db)

        seed('members', [
            { name: 'John' },
            { age: 20, name: 'Jane' },
            { name: 'Jack' },
            { age: 27, name: 'Jane' }
        ])

        const members = await repo.query<Members>('members', {
            where: [['name', '==', 'Jane']]
        })

        expect(members).toEqual([
            { age: 20, name: 'Jane' },
            { age: 27, name: 'Jane' }
        ])
    })

    it('should AND multiple query constraints together', async () => {
        const db = getDB()
        const repo = getRepository(db)

        seed('members', [
            { name: 'John' },
            { age: 20, name: 'Jane' },
            { name: 'Jack' },
            { age: 27, name: 'Jane' }
        ])

        const members = await repo.query<Members>('members', {
            where: [
                ['name', '==', 'Jane'],
                ['age', '>=', 25]
            ]
        })

        expect(members).toEqual([{ age: 27, name: 'Jane' }])
    })

    it('should be possible to limit the amount of rows returned by query', async () => {
        const db = getDB()
        const repo = getRepository(db)

        seed('members', [
            { name: 'John' },
            { age: 20, name: 'Jane' },
            { name: 'Jack' },
            { age: 27, name: 'Jane' }
        ])

        const members = await repo.query<Members>('members', {
            limit: 2
        })

        expect(members).toEqual([{ name: 'John' }, { age: 20, name: 'Jane' }])
    })

    it('should return only requested query fields', async () => {
        const db = getDB()
        const repo = getRepository(db)

        seed('members', [
            { name: 'John' },
            { age: 20, name: 'Jane' },
            { name: 'Jack' },
            { age: 27, name: 'Jane' }
        ])

        const members = await repo.query<Members>('members', undefined, [
            'name'
        ])

        expect(members).toEqual([
            { name: 'John' },
            { name: 'Jane' },
            { name: 'Jack' },
            { name: 'Jane' }
        ])
    })
})
