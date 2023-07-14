import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import getAlgoliaClient from '@core/services/algolia'
import { resetMockAlgolia, verifyMock } from '@core/services/algolia/mock'

import { getAlgoliaIndex } from '~core/utils/algolia'

describe('algolia', () => {
    beforeAll(async () => {
        vi.mock(
            '@core/services/algolia',
            () => import('@core/services/algolia/mock')
        )

        const spy = vi.spyOn(verifyMock, 'verifyMock')
        getAlgoliaIndex('test')
        expect(spy).toHaveBeenCalled()
        resetMockAlgolia()

        return () => {
            vi.restoreAllMocks()
        }
    })

    afterEach(() => {
        resetMockAlgolia()
    })

    const algolia = getAlgoliaClient()

    it('should create an index', async () => {
        algolia.initIndex('test')
        expect(algolia.listIndices()).toEqual(['test'])
    })

    it('should create an object', async () => {
        const index = algolia.initIndex('test')

        await index.saveObject({ name: 'test', objectID: '1' })

        expect(await index.getObject('1')).toEqual({
            name: 'test',
            objectID: '1'
        })
    })

    it("should return `null` if an object doesn't exist", async () => {
        const index = algolia.initIndex('test')

        expect(await index.getObject('1')).toBeNull()
    })

    it('should create multiple objects', async () => {
        const index = algolia.initIndex('test')

        await index.saveObjects([
            { name: 'test', objectID: '1' },
            { name: 'test', objectID: '2' }
        ])

        expect((await index.getObjects(['1', '2'])).results).toEqual([
            { name: 'test', objectID: '1' },
            { name: 'test', objectID: '2' }
        ])
    })

    it('should fully replace an object', async () => {
        const index = algolia.initIndex('test')

        await index.saveObjects([
            { lastName: 'test', name: 'test', objectID: '1' },
            { lastName: 'test', name: 'test', objectID: '2' }
        ])

        await index.saveObject({ name: 'test2', objectID: '1' })

        expect((await index.getObjects(['1', '2'])).results).toEqual([
            { name: 'test2', objectID: '1' },
            { lastName: 'test', name: 'test', objectID: '2' }
        ])
    })

    it('should fully replace multiple objects', async () => {
        const index = algolia.initIndex('test')

        await index.saveObjects([
            { lastName: 'test', name: 'test', objectID: '1' },
            { lastName: 'test', name: 'test', objectID: '2' },
            { lastName: 'test', name: 'test', objectID: '3' }
        ])

        await index.saveObjects([
            { name: 'test1', objectID: '1' },
            { name: 'test2', objectID: '2' }
        ])

        expect((await index.getObjects(['1', '2', '3'])).results).toEqual([
            { name: 'test1', objectID: '1' },
            { name: 'test2', objectID: '2' },
            { lastName: 'test', name: 'test', objectID: '3' }
        ])
    })

    it('should partially update an object', async () => {
        const index = algolia.initIndex('test')

        await index.saveObjects([
            { lastName: 'test', name: 'test', objectID: '1' },
            { lastName: 'test', name: 'test', objectID: '2' }
        ])

        await index.partialUpdateObject({ name: 'test2', objectID: '1' })

        expect((await index.getObjects(['1', '2'])).results).toEqual([
            { lastName: 'test', name: 'test2', objectID: '1' },
            { lastName: 'test', name: 'test', objectID: '2' }
        ])
    })

    it("should not create an object if it doesn't exist in a partial update by default", async () => {
        const index = algolia.initIndex('test')

        await index.saveObjects([
            { lastName: 'test', name: 'test', objectID: '1' },
            { lastName: 'test', name: 'test', objectID: '2' }
        ])

        await index.partialUpdateObject({ name: 'test2', objectID: '3' })

        expect((await index.getObjects(['1', '2', '3'])).results).toEqual([
            { lastName: 'test', name: 'test', objectID: '1' },
            { lastName: 'test', name: 'test', objectID: '2' },
            null
        ])
    })

    it("should be able to create on object if it doesn't exist in a partial update", async () => {
        const index = algolia.initIndex('test')

        await index.saveObjects([
            { lastName: 'test', name: 'test', objectID: '1' },
            { lastName: 'test', name: 'test', objectID: '2' }
        ])

        await index.partialUpdateObject(
            { name: 'test2', objectID: '3' },
            { createIfNotExists: true }
        )

        expect((await index.getObjects(['1', '2', '3'])).results).toEqual([
            { lastName: 'test', name: 'test', objectID: '1' },
            { lastName: 'test', name: 'test', objectID: '2' },
            { name: 'test2', objectID: '3' }
        ])
    })

    it('should partially update multiple objects', async () => {
        const index = algolia.initIndex('test')

        await index.saveObjects([
            { lastName: 'test', name: 'test', objectID: '1' },
            { lastName: 'test', name: 'test', objectID: '2' },
            { lastName: 'test', name: 'test', objectID: '3' }
        ])

        await index.partialUpdateObjects([
            { name: 'test1', objectID: '1' },
            { name: 'test2', objectID: '2' }
        ])

        expect((await index.getObjects(['1', '2', '3'])).results).toEqual([
            { lastName: 'test', name: 'test1', objectID: '1' },
            { lastName: 'test', name: 'test2', objectID: '2' },
            { lastName: 'test', name: 'test', objectID: '3' }
        ])
    })

    it('should delete an object', async () => {
        const index = algolia.initIndex('test')

        await index.saveObjects([
            { name: 'test', objectID: '1' },
            { name: 'test', objectID: '2' }
        ])

        await index.deleteObject('1')

        expect((await index.getObjects(['1', '2'])).results).toEqual([
            null,
            { name: 'test', objectID: '2' }
        ])
    })

    it('should delete multiple objects', async () => {
        const index = algolia.initIndex('test')

        await index.saveObjects([
            { name: 'test', objectID: '1' },
            { name: 'test', objectID: '2' },
            { name: 'test', objectID: '3' }
        ])

        await index.deleteObjects(['1', '3'])

        expect((await index.getObjects(['1', '2', '3'])).results).toEqual([
            null,
            { name: 'test', objectID: '2' },
            null
        ])
    })

    it('should clear all objects', async () => {
        const index = algolia.initIndex('test')

        await index.saveObjects([
            { name: 'test', objectID: '1' },
            { name: 'test', objectID: '2' }
        ])

        await index.clearObjects()

        expect((await index.getObjects(['1', '2'])).results).toEqual([
            null,
            null
        ])
    })

    it('should browse objects', async () => {
        const index = algolia.initIndex('test')

        await index.saveObjects([
            { name: 'test', objectID: '1' },
            { name: 'test', objectID: '2' }
        ])

        const objects: any[] = []
        await index.browseObjects({
            batch: (hits) => {
                objects.push(...hits)
            }
        })

        expect(objects).toEqual([
            { name: 'test', objectID: '1' },
            { name: 'test', objectID: '2' }
        ])
    })

    it('should return a `wait` function for all creating and modifying methods', async () => {
        const index = algolia.initIndex('test')
        expect(
            index.saveObject({ name: 'test', objectID: '1' })
        ).toHaveProperty('wait')
        expect(
            index.saveObjects([{ name: 'test', objectID: '1' }])
        ).toHaveProperty('wait')
        expect(
            index.partialUpdateObject({ name: 'test', objectID: '1' })
        ).toHaveProperty('wait')
        expect(
            index.partialUpdateObjects([{ name: 'test', objectID: '1' }])
        ).toHaveProperty('wait')
        expect(index.deleteObject('1')).toHaveProperty('wait')
        expect(index.deleteObjects(['1'])).toHaveProperty('wait')
        expect(index.clearObjects()).toHaveProperty('wait')
    })

    it('should still be instances of promises for all creating and modifying methods', async () => {
        const index = algolia.initIndex('test')

        expect(
            index.saveObject({ name: 'test', objectID: '1' })
        ).toBeInstanceOf(Promise)
        expect(
            index.saveObjects([{ name: 'test', objectID: '1' }])
        ).toBeInstanceOf(Promise)
        expect(
            index.partialUpdateObject({ name: 'test', objectID: '1' })
        ).toBeInstanceOf(Promise)
        expect(
            index.partialUpdateObjects([{ name: 'test', objectID: '1' }])
        ).toBeInstanceOf(Promise)
        expect(index.deleteObject('1')).toBeInstanceOf(Promise)
        expect(index.deleteObjects(['1'])).toBeInstanceOf(Promise)
        expect(index.clearObjects()).toBeInstanceOf(Promise)
    })
})
