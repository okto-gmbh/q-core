import { Readable } from 'node:stream'

import type { Metadata, Storage } from '@core/storage/interface'

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
        download: async (path: string) => {
            const data = LOCAL_STORAGE[path]?.data
            if (!data) throw new Error(`File ${path} does not exist`)
            return data
        },
        exists: async (path: string) => !!LOCAL_STORAGE[path],
        getFiles: async (path?: string) =>
            path === undefined
                ? Object.keys(LOCAL_STORAGE)
                : Object.keys(LOCAL_STORAGE).filter((key) =>
                      key.startsWith(path)
                  ),
        getMetadata: async (path: string): Promise<Metadata> =>
            LOCAL_STORAGE[path]?.metadata,
        remove: async (path: string) => {
            const files = Object.keys(LOCAL_STORAGE).filter((key) =>
                key.startsWith(path)
            )
            for (const path of files) {
                delete LOCAL_STORAGE[path]
            }
        },
        stream: (path: string) => {
            const data = LOCAL_STORAGE[path]?.data
            if (!data) throw new Error(`File ${path} does not exist`)

            const stream = new Readable()
            stream.push(data)
            stream.push(null)
            return stream
        },
        upload: async (path: string, data: Buffer) => {
            LOCAL_STORAGE[path] = {
                data,
                metadata: {
                    contentType: '',
                    size: data.length,
                    updated: new Date().toISOString()
                }
            }
        }
    }
}

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
