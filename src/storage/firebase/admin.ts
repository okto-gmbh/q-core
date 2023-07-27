import type { Storage } from '@core/storage/interface'

import type { Storage as AdminStorage } from 'firebase-admin/storage'

type Bucket = ReturnType<AdminStorage['bucket']>

export const getStorage = (bucket: Bucket): Storage => ({
    download: async (path: string) => {
        const file = bucket.file(path)
        const [data] = await file.download()
        return data
    },
    exists: async (path: string) => {
        const file = bucket.file(path)
        const [exists] = await file.exists()
        return exists
    },
    getFiles: async (path?: string) => {
        const [files] = await bucket.getFiles({ prefix: path })
        return files.map((file) => file.name)
    },
    getMetadata: async (path: string) => {
        const file = bucket.file(path)
        const [{ contentType, size, updated }] = await file.getMetadata()
        return {
            contentType,
            size,
            updated
        }
    },
    remove: async (path: string) => {
        await bucket.deleteFiles({ prefix: path })
    },
    stream: (path: string) => {
        const file = bucket.file(path)
        return file.createReadStream()
    },
    upload: async (path: string, data: Buffer) => {
        const file = bucket.file(path)
        return file.save(data)
    }
})

export default getStorage
