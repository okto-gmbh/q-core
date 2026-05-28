import { createHash } from 'node:crypto'
import { createReadStream, existsSync } from 'node:fs'
import { readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'

import type { Metadata, Storage } from '@core/storage/interface'

export const getStorage = (): Storage => ({
    download: async (path: string) => {
        return await readFile(path)
    },
    exists: async (path: string) => {
        return existsSync(path)
    },
    getFiles: async (path?: string) => {
        return await readdir(path || '.', { recursive: true })
    },
    getMetadata: async (path: string) => {
        const stats = await stat(path)
        const content = await readFile(path)

        const hash = createHash('sha256').update(content).digest('hex')
        let contentType = ''
        if (content.toString().startsWith('<svg')) {
            contentType = 'image/svg+xml'
        } else if (content.slice(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) {
            contentType = 'image/png'
        } else if (content.slice(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
            contentType = 'image/jpeg'
        } else if (content.slice(0, 4).equals(Buffer.from([0x47, 0x49, 0x46, 0x38]))) {
            contentType = 'image/gif'
        }

        return {
            created: stats.birthtime.toISOString(),
            hash,
            updated: stats.mtime.toISOString(),
            contentType,
            size: stats.size,
        } satisfies Metadata
    },
    remove: async (path: string) => {
        await rm(path, {
            recursive: true,
        })
    },
    setMetadata: async () => {
        // Not supported in local storage, so this is a no-op
    },
    stream: (path: string) => {
        return createReadStream(path)
    },
    upload: async (path: string, data: Buffer, metadata?: Partial<Metadata>) => {
        await writeFile(path, data)
    },
})

export default getStorage
