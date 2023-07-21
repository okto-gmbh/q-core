import { Readable } from 'node:stream'

import type { File, Metadata, Storage } from '@core/storage/firebase/interface'

import type { Storage as AdminStorage } from 'firebase-admin/storage'

type Bucket = ReturnType<AdminStorage['bucket']>

interface LocalStorage {
    [path: string]: LocalFile
}

interface LocalFile {
    data: Buffer
    metadata: Metadata
}

const LOCAL_STORAGE: LocalStorage = {}

const getStorage = (bucket?: Bucket): Storage => {
    verifyMock.verifyMock()
    void bucket

    return {
        deleteFile: async (path: string) => {
            const file = getFile(path)
            return await file.delete()
        },
        deleteFiles: async (path: string) => {
            const files = Object.keys(LOCAL_STORAGE).filter((key) =>
                key.startsWith(path)
            )
            for (const path of files) {
                const file = getFile(path)
                await file.delete()
            }
        },
        downloadFile: async (path: string) => {
            const file = getFile(path)
            return file.download()
        },
        file: (path: string) => getFile(path),
        fileExists: async (path: string) => {
            const file = getFile(path)
            return file.exists()
        },
        getFiles: async (path?: string) => {
            const allFiles = Object.keys(LOCAL_STORAGE)
            const files = path
                ? allFiles.filter((key) => key.startsWith(path))
                : allFiles
            return files.map((file) => getFile(file))
        },
        getReadStream: (path: string) => {
            const file = getFile(path)
            return file.createReadStream()
        },
        uploadFile: async (path: string, data: Buffer) => {
            const file = getFile(path)
            return file.save(data)
        }
    }
}

const getFile = (path: string): File => ({
    createReadStream: () => {
        const data = LOCAL_STORAGE[path]?.data
        if (!data) throw new Error(`File ${path} does not exist`)

        const stream = new Readable()
        stream.push(data)
        stream.push(null)
        return stream
    },
    delete: async () => {
        delete LOCAL_STORAGE[path]
    },
    download: async () => {
        const data = LOCAL_STORAGE[path]?.data
        if (!data) throw new Error(`File ${path} does not exist`)

        return data
    },
    exists: async () => !!LOCAL_STORAGE[path],
    get metadata() {
        return !!LOCAL_STORAGE[path]
    },
    getMetadata: async () => LOCAL_STORAGE[path]?.metadata,
    get name() {
        return path
    },
    save: async (data: Buffer) => {
        LOCAL_STORAGE[path] = {
            data,
            metadata: {
                contentType: '',
                size: data.length,
                updated: new Date().toISOString()
            }
        }
    },
    setMetadata: async (metadata) => {
        LOCAL_STORAGE[path].metadata = {
            ...LOCAL_STORAGE[path]?.metadata,
            ...metadata
        }
    }
})

export const seedMockStorage = (data: {
    [path: string]: Omit<LocalFile, 'metadata'> &
        Partial<Pick<LocalFile, 'metadata'>>
}) => {
    const completeObject = Object.fromEntries(
        Object.entries(data).map(([filePath, fileContent]) => {
            if (data[filePath].metadata === undefined) {
                return [
                    filePath,
                    {
                        ...fileContent,
                        metadata: {
                            contentType: '',
                            size: data[filePath].data.length,
                            updated: new Date().toISOString()
                        }
                    }
                ]
            } else {
                return [filePath, fileContent]
            }
        })
    )
    Object.assign(LOCAL_STORAGE, completeObject)
}

export const resetMockStorage = () => {
    Object.keys(LOCAL_STORAGE).forEach((key) => {
        delete LOCAL_STORAGE[key]
    })
}

export const getRawMockStorage = () => LOCAL_STORAGE

export const getMockBucket = () => ({} as Bucket)

export const verifyMock = {
    verifyMock() {
        return true
    }
}

export default getStorage
