import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'

import type { Readable } from 'node:stream'

type AuthContext = {
    clientId: string
    clientSecret: string
    redirectUri: string
    tenantId: string
}

async function getAccessToken({
    clientId,
    clientSecret,
    redirectUri,
    tenantId,
}: AuthContext): Promise<string> {
    const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
        redirect_uri: redirectUri,
        scope: 'https://graph.microsoft.com/.default',
    })

    const response = await fetch(
        `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
        {
            body: params.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
        }
    )

    const json = await response.json()

    if (json.error) {
        throw new Error(json.error)
    }

    if (typeof json.access_token !== 'string') {
        throw new Error('Access token is not a string')
    }

    return json.access_token
}

type SessionContext = {
    accessToken: string
    targetFileName: string
    targetFolder: string
    targetSite: string
}

async function createUploadSession({
    accessToken,
    targetFileName,
    targetFolder,
    targetSite,
}: SessionContext) {
    const response = await fetch(
        `https://graph.microsoft.com/v1.0/drives/${targetSite}/${targetFolder}/${targetFileName}:/createUploadSession`,
        {
            body: JSON.stringify({
                item: {
                    '@microsoft.graph.conflictBehavior': 'replace',
                    name: targetFileName,
                },
            }),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            method: 'POST',
        }
    )

    return await response.json()
}

const CHUNK_SIZE = 60 * 1024 * 1024

function getChunks(size: number) {
    const sep = size < CHUNK_SIZE ? size : CHUNK_SIZE - 1

    const params: {
        chunkEnd: number
        chunkStart: number
        contentLength: number
        contentRange: string
    }[] = []

    for (let i = 0; i < size; i += sep) {
        const chunkStart = i
        const chunkEnd = i + sep - 1 < size ? i + sep - 1 : size - 1
        const contentRange = 'bytes ' + chunkStart + '-' + chunkEnd + '/' + size
        const contentLength = chunkEnd != size - 1 ? sep : size - i

        params.push({
            chunkEnd,
            chunkStart,
            contentLength,
            contentRange,
        })
    }

    return params
}

export interface BackupOptions {
    sourceFile: string
    targetFileName: string
    redirectUri?: string
    targetFolder?: string
}

export default async function uploadFile({
    redirectUri = 'http://localhost',
    sourceFile,
    targetFileName,
    targetFolder = 'root:',
}: BackupOptions) {
    validateEnv(process.env)

    const accessToken = await getAccessToken({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri,
        tenantId: process.env.TENANT_ID,
    })

    const uploadSession = await createUploadSession({
        accessToken,
        targetFileName,
        targetFolder,
        targetSite: process.env.TARGET_SITE,
    })

    if (uploadSession.error || !uploadSession.uploadUrl) {
        throw new Error('Creating upload session failed: ' + uploadSession.error.message)
    }

    const stats = await stat(sourceFile)
    const size = stats.size
    const chunks = getChunks(size)
    const stream = createReadStream(sourceFile, {
        highWaterMark: Math.ceil(size / (chunks.length - 1 || 1)),
    })

    for (const chunk of chunks) {
        const content = await readBytes(stream, chunk.contentLength)

        const response = await fetch(uploadSession.uploadUrl, {
            body: content,
            headers: {
                'Content-Length': chunk.contentLength + '',
                'Content-Range': chunk.contentRange,
            },
            method: 'PUT',
        })

        const json = await response.json()

        if (json.error) {
            throw new Error(json.errors)
        }

        if (chunk.chunkEnd === size - 1) {
            return
        }
    }
}

/**
 * Allows to await a stream for a specified amount of data to be available
 * @param stream The stream to read from
 * @param bytes The number of bytes to read
 * @returns Promise<Uint8Array>
 */
async function readBytes(stream: Readable, bytes: number): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve, reject) => {
        const read = () => {
            if (stream.readableLength >= bytes) {
                stream.pause()
                stream.off('readable', read)
                return resolve(stream.read(bytes))
            }

            if (stream.isPaused()) {
                stream.resume()
            }
        }
        stream.on('readable', read)
        stream.pause()
    })
}

function validateEnv(env: typeof process.env = process.env): asserts env is {
    CLIENT_ID: string
    CLIENT_SECRET: string
    NODE_ENV: typeof process.env.NODE_ENV
    TARGET_SITE: string
    TENANT_ID: string
} {
    if (typeof env.CLIENT_ID !== 'string') {
        throw new Error('process.env.CLIENT_ID is not defined')
    }
    if (typeof env.CLIENT_SECRET !== 'string') {
        throw new Error('CLIENT_SECRET is not defined')
    }
    if (typeof env.TENANT_ID !== 'string') {
        throw new Error('TENANT_ID is not defined')
    }
    if (typeof env.TARGET_SITE !== 'string') {
        throw new Error('TARGET_SITE is not defined')
    }
}
