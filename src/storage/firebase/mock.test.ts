import { Readable } from 'node:stream'

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import getStorage from '@core/storage/firebase/admin'
import {
    getMockBucket,
    getRawMockStorage,
    resetMockStorage,
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

    it('should create a file handle, without uploading', async () => {
        const bucket = getMockBucket()
        const storage = getStorage(bucket)
        storage.file('test.txt')
        expect(Object.entries(getRawMockStorage())).toHaveLength(0)
    })

    it('should upload a file', async () => {
        const bucket = getMockBucket()
        const storage = getStorage(bucket)
        await storage.uploadFile('test.txt', Buffer.from('test'))
        expect(Object.entries(getRawMockStorage())).toHaveLength(1)
    })

    it('should download a file', async () => {
        const bucket = getMockBucket()
        const storage = getStorage(bucket)
        await storage.uploadFile('test.txt', Buffer.from('test'))
        const data = await storage.downloadFile('test.txt')
        expect(data.toString()).toBe('test')
    })

    it('should delete a file', async () => {
        const bucket = getMockBucket()
        const storage = getStorage(bucket)
        await storage.uploadFile('test.txt', Buffer.from('test'))
        expect(Object.entries(getRawMockStorage())).toHaveLength(1)
        await storage.deleteFile('test.txt')
        expect(Object.entries(getRawMockStorage())).toHaveLength(0)
    })

    it('should delete multiple files', async () => {
        const bucket = getMockBucket()
        const storage = getStorage(bucket)
        await storage.uploadFile('directory/test.txt', Buffer.from('test'))
        await storage.uploadFile('directory/test2.txt', Buffer.from('test'))
        await storage.uploadFile(
            'other/directory/test3.txt',
            Buffer.from('test')
        )
        expect(Object.entries(getRawMockStorage())).toHaveLength(3)
        await storage.deleteFiles('directory')
        expect(Object.entries(getRawMockStorage())).toHaveLength(1)
    })

    it('should check if a file exists', async () => {
        const bucket = getMockBucket()
        const storage = getStorage(bucket)
        await storage.uploadFile('test.txt', Buffer.from('test'))
        expect(await storage.fileExists('test.txt')).toBe(true)
        expect(await storage.fileExists('test2.txt')).toBe(false)
    })

    it('should save a file', async () => {
        const bucket = getMockBucket()
        const storage = getStorage(bucket)
        const file = storage.file('test.txt')
        await file.save(Buffer.from('test'))
        expect(Object.entries(getRawMockStorage())).toHaveLength(1)
    })

    it('should stream the data', async () => {
        const bucket = getMockBucket()
        const storage = getStorage(bucket)
        const file = storage.file('test.txt')
        await file.save(Buffer.from('test'))
        const stream = file.createReadStream()
        expect(stream).toBeInstanceOf(Readable)
    })

    it('should get multiple files', async () => {
        const bucket = getMockBucket()
        const storage = getStorage(bucket)
        await storage.uploadFile('directory/test.txt', Buffer.from('test'))
        await storage.uploadFile('directory/test2.txt', Buffer.from('test'))
        await storage.uploadFile(
            'other/directory/test3.txt',
            Buffer.from('test')
        )
        const allFiles = await storage.getFiles('')
        expect(allFiles).toHaveLength(3)

        const directoryFiles = await storage.getFiles('directory')
        expect(directoryFiles).toHaveLength(2)
    })
})
