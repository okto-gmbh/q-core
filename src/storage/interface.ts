export interface Storage {
    download: (path: string) => NodeJS.ReadableStream
    exists: (path: string) => Promise<boolean>
    getFiles: () => Promise<string[]>
    getMetadata: (path: string) => Promise<Metadata>
    remove: (path: string) => Promise<void>
    upload: (path: string, file: Buffer) => Promise<void>
}

export interface Metadata {
    [key: string]: unknown
    contentType: string
    name: string
    size: number
    updated: string
}
