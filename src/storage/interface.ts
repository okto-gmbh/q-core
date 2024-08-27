export interface Storage {
    download: (path: string) => Promise<Buffer>
    exists: (path: string) => Promise<boolean>
    getFiles: (path?: string) => Promise<string[]>
    getMetadata: (path: string) => Promise<Metadata>
    remove: (path: string) => Promise<void>
    setMetadata: (path: string, metadata: Partial<Metadata>) => Promise<void>
    stream: (path: string) => NodeJS.ReadableStream
    upload: (path: string, file: Buffer, metadata?: Partial<Metadata>) => Promise<void>
}

export interface Metadata {
    [key: string]: unknown
    contentType: string
    created: string
    hash: string
    size: number
    updated: string
}
