export interface Storage {
    deleteFile: (path: string) => Promise<void>
    deleteFiles: (path: string) => Promise<void>
    downloadFile: (path: string) => Promise<Buffer>
    file: (path: string) => File
    fileExists: (path: string) => Promise<boolean>
    getFiles: (path?: string) => Promise<File[]>
    getReadStream: (path: string) => NodeJS.ReadableStream
    uploadFile: (path: string, file: Buffer) => Promise<void>
}

export interface File {
    createReadStream: () => NodeJS.ReadableStream
    delete: () => Promise<void>
    download: () => Promise<Buffer>
    exists: () => Promise<boolean>
    getMetadata: () => Promise<Metadata>
    name: string
    save: (data: Buffer) => Promise<void>
    setMetadata: (metadata: Metadata) => Promise<void>
}

export interface Metadata {
    [key: string]: any
    contentType: string
    size: number
    updated: string
}
