import type { Metadata, Storage } from '@core/storage/interface'

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
        const [{ contentType, size, updated, ...rest }] =
            await file.getMetadata()
        return {
            contentType,
            size,
            updated,
            ...rest
        }
    },
    remove: async (path: string) => {
        await bucket.deleteFiles({ prefix: path })
    },
    setMetadata: async (path: string, metadata: Partial<Metadata>) => {
        const file = bucket.file(path)
        await file.setMetadata(metadata)
    },
    stream: (path: string) => {
        const file = bucket.file(path)
        return file.createReadStream()
    },
    upload: async (
        path: string,
        data: Buffer,
        metadata?: Partial<Metadata>
    ) => {
        const file = bucket.file(path)
        await file.save(data, metadata ? { metadata } : undefined)
    }
})

export default getStorage
