/* eslint-disable security/detect-non-literal-fs-filename */
import fs from 'fs'

import async from 'async'
import request from 'request'

type AuthContext = {
    clientId: string
    clientSecret: string
    redirectUri: string
    tenantId: string
}

const authenticate = async ({
    clientId,
    clientSecret,
    redirectUri,
    tenantId
}: AuthContext) =>
    new Promise((resolve, reject) => {
        request.post(
            {
                form: {
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: 'client_credentials',
                    redirect_uri: redirectUri,
                    scope: 'https://graph.microsoft.com/.default'
                },
                url: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`
            },
            (error, _, body) => {
                if (error) {
                    reject(error)
                    return
                }

                const json = JSON.parse(body)
                if (json.error) {
                    reject(json.error)
                    return
                }

                resolve(JSON.parse(body).access_token)
            }
        )
    })

type SessionContext = {
    accessToken: string
    targetFileName: string
    targetFolder: string
    targetSite: string
}

const createUploadSession = async ({
    accessToken,
    targetFileName,
    targetFolder,
    targetSite
}: SessionContext) =>
    new Promise((resolve, reject) => {
        request.post(
            {
                body: `{"item": {"@microsoft.graph.conflictBehavior": "replace", "name": "${targetFileName}"}}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                url: `https://graph.microsoft.com/v1.0/drives/${targetSite}/${targetFolder}/${targetFileName}:/createUploadSession`
            },
            (error, _, body) => {
                if (error) {
                    reject(error)
                    return
                }

                const json = JSON.parse(body)
                if (json.error) {
                    reject(json.error)
                    return
                }

                resolve(json.uploadUrl)
            }
        )
    })

type UploadContext = {
    sourceFile: string
    uploadUrl: string
}

const uploadFile = async ({ sourceFile, uploadUrl }: UploadContext) => {
    await async.eachSeries(getParams(sourceFile), (param, callback) => {
        setTimeout(() => {
            fs.readFile(sourceFile, (_, content) => {
                request.put({
                    body: content.slice(param.bstart, param.bend + 1),
                    headers: {
                        'Content-Length': param.clen,
                        'Content-Range': param.cr
                    },
                    url: uploadUrl
                })
            })
            callback()
        }, param.stime)
    })
}

const getParams = (sourceFile: string) => {
    const allsize = fs.statSync(sourceFile).size
    const sep = allsize < 60 * 1024 * 1024 ? allsize : 60 * 1024 * 1024 - 1
    const params = []
    for (let i = 0; i < allsize; i += sep) {
        const bstart = i
        const bend = i + sep - 1 < allsize ? i + sep - 1 : allsize - 1
        const cr = 'bytes ' + bstart + '-' + bend + '/' + allsize
        const clen = bend != allsize - 1 ? sep : allsize - i
        const stime = allsize < 60 * 1024 * 1024 ? 5000 : 10000
        params.push({
            bend,
            bstart,
            clen,
            cr,
            stime
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

export default async ({
    redirectUri = 'http://localhost',
    sourceFile,
    targetFileName,
    targetFolder = 'root:'
}: BackupOptions) => {
    const accessToken = await authenticate({
        clientId: process.env.CLIENT_ID!,
        clientSecret: process.env.CLIENT_SECRET!,
        redirectUri,
        tenantId: process.env.TENANT_ID!
    })

    if (!accessToken) {
        throw new Error('Authentication failed')
    }

    const uploadUrl = await createUploadSession({
        accessToken: String(accessToken),
        targetFileName,
        targetFolder,
        targetSite: process.env.TARGET_SITE!
    })

    if (!uploadUrl) {
        throw new Error('Creating upload session failed')
    }

    await uploadFile({
        sourceFile,
        uploadUrl: String(uploadUrl)
    })
}
