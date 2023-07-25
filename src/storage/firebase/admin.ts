import type { File, Storage } from '@core/storage/interface'

import type { Storage as AdminStorage } from 'firebase-admin/storage'

type Bucket = ReturnType<AdminStorage['bucket']>

export const getStorage = (bucket: Bucket): Storage => ({
    deleteFile: async (path: string) => {
        const file = getFile(bucket, path)
        return await file.delete()
    },
    deleteFiles: async (path: string) => bucket.deleteFiles({ prefix: path }),
    downloadFile: async (path: string) => {
        const file = getFile(bucket, path)
        return file.download()
    },
    file: (path: string) => getFile(bucket, path),
    fileExists: async (path: string) => {
        const file = getFile(bucket, path)
        return file.exists()
    },
    getFiles: async (path?: string) => {
        const [files] = await bucket.getFiles(
            path ? { prefix: path } : undefined
        )
        return files.map((file) => getFile(bucket, file.name))
    },
    getReadStream: (path: string) => {
        const file = getFile(bucket, path)
        return file.createReadStream()
    },
    uploadFile: async (path: string, data: Buffer) => {
        const file = getFile(bucket, path)
        return file.save(data)
    }
})

const getFile = (bucket: Bucket, path: string): File => {
    const file = bucket.file(path)

    return {
        createReadStream: () => file.createReadStream(),
        delete: async () => void file.delete(),
        download: async () => {
            const [data] = await file.download()
            return data
        },
        exists: async () => {
            const [exists] = await file.exists()
            return exists
        },
        getMetadata: async () => {
            const [metadata] = await file.getMetadata()
            return metadata
        },
        name: file.name,
        save: async (data: Buffer) => file.save(data),
        setMetadata: async (metadata) => void file.setMetadata(metadata)
    }
}

export default getStorage
