import type { Storage } from '@core/storage/interface'

import type { Storage as AdminStorage } from 'firebase-admin/storage'

type Bucket = ReturnType<AdminStorage['bucket']>

export const getStorage = (bucket: Bucket): Storage => ({
    download: (path: string) => {
        const file = bucket.file(path)
        return file.createReadStream()
    },
    exists: async (path: string) => {
        const file = bucket.file(path)
        const [exists] = await file.exists()
        return exists
    },
    getFiles: async () => {
        const [files] = await bucket.getFiles()
        return files.map((file) => file.name)
    },
    getMetadata: async (path: string) => {
        const file = bucket.file(path)
        const [metadata] = await file.getMetadata()
        return metadata
    },
    remove: async (path: string) => {
        const file = bucket.file(path)
        const [exists] = await file.exists()
        if (exists) {
            await file.delete()
        } else {
            await bucket.deleteFiles({ prefix: path })
        }
    },
    upload: async (path: string, data: Buffer) => {
        const file = bucket.file(path)
        return file.save(data)
    }
})

export default getStorage
