import { Readable } from 'node:stream'

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import getStorage from '@core/storage/firebase/admin'
import {
    getMockBucket,
    getRawMockStorage,
    resetMockStorage,
    seedMockStorage,
    verifyMock
} from '@core/storage/firebase/mock'

describe('firestore', () => {
    beforeAll(() => {
        vi.mock(
            '@core/storage/firebase/admin',
            () => import('@core/storage/firebase/mock')
        )

        const spy = vi.spyOn(verifyMock, 'verifyMock')
        getStorage(getMockBucket())
        expect(spy).toHaveBeenCalled()
        resetMockStorage()

        return () => {
            vi.restoreAllMocks()
        }
    })

    afterEach(() => {
        resetMockStorage()
    })

    it('should mock the storage', async () => {
        const spy = vi.spyOn(verifyMock, 'verifyMock')
        getStorage(getMockBucket())
        expect(spy).toHaveBeenCalled()
    })

    it('should seed the mock storage with multiple files as defined', () => {
        const testData = {
            'test.txt': {
                data: Buffer.from('test'),
                metadata: {
                    contentType: 'text/plain',
                    name: 'test.txt',
                    size: 4,
                    updated: new Date().toISOString()
                }
            },
            'test2.txt': {
                data: Buffer.from('test'),
                metadata: {
                    contentType: 'text/plain',
                    name: 'test2.txt',
                    size: 4,
                    updated: new Date().toISOString()
                }
            }
        }

        seedMockStorage(testData)
        expect(getRawMockStorage()).toEqual(testData)
    })

    it('should seed the mock storage auto generated metadata', () => {
        const testData = {
            'test.txt': {
                data: Buffer.from('test')
            },
            'test2.txt': {
                data: Buffer.from('test')
            }
        }

        seedMockStorage(testData)
        const storageData = getRawMockStorage()

        expect(storageData['test.txt'].metadata).toBeDefined()
        expect(storageData['test2.txt'].metadata).toBeDefined()
    })

    it('should get all files', async () => {
        const testData = {
            'directory/test.txt': {
                data: Buffer.from('test')
            },
            'directory/test2.txt': {
                data: Buffer.from('test')
            },
            'directory2/test.txt': {
                data: Buffer.from('test')
            }
        }

        seedMockStorage(testData)
        const storage = getStorage(getMockBucket())
        const files = await storage.getFiles()
        expect(files).toHaveLength(3)
    })

    it('should get all matching files', async () => {
        const testData = {
            'directory/test.txt': {
                data: Buffer.from('test')
            },
            'directory/test2.txt': {
                data: Buffer.from('test')
            },
            'directory2/test.txt': {
                data: Buffer.from('test')
            }
        }

        seedMockStorage(testData)
        const storage = getStorage(getMockBucket())
        const files = await storage.getFiles('directory/')
        expect(files).toHaveLength(2)
    })

    it('should upload a file', async () => {
        const bucket = getMockBucket()
        const storage = getStorage(bucket)
        await storage.upload('test.txt', Buffer.from('test'))
        expect(Object.entries(getRawMockStorage())).toHaveLength(1)
    })

    it('should stream a file', async () => {
        const bucket = getMockBucket()
        const storage = getStorage(bucket)
        await storage.upload('test.txt', Buffer.from('test'))
        const stream = storage.stream('test.txt')
        expect(stream).toBeInstanceOf(Readable)
    })

    it('should download a file', async () => {
        const bucket = getMockBucket()
        const storage = getStorage(bucket)
        await storage.upload('test.txt', Buffer.from('test'))
        const buffer = await storage.download('test.txt')
        expect(buffer.toString()).toBe('test')
    })

    it('should remove a file', async () => {
        const bucket = getMockBucket()
        const storage = getStorage(bucket)
        await storage.upload('test.txt', Buffer.from('test'))
        expect(Object.entries(getRawMockStorage())).toHaveLength(1)
        await storage.remove('test.txt')
        expect(Object.entries(getRawMockStorage())).toHaveLength(0)
    })

    it('should remove multiple files', async () => {
        const bucket = getMockBucket()
        const storage = getStorage(bucket)
        await storage.upload('directory/test.txt', Buffer.from('test'))
        await storage.upload('directory/test2.txt', Buffer.from('test'))
        await storage.upload('other/directory/test3.txt', Buffer.from('test'))
        expect(Object.entries(getRawMockStorage())).toHaveLength(3)
        await storage.remove('directory')
        expect(Object.entries(getRawMockStorage())).toHaveLength(1)
    })

    it('should check if a file exists', async () => {
        const bucket = getMockBucket()
        const storage = getStorage(bucket)
        await storage.upload('test.txt', Buffer.from('test'))
        expect(await storage.exists('test.txt')).toBe(true)
        expect(await storage.exists('test2.txt')).toBe(false)
    })
})
