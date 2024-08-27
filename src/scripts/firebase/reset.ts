/* eslint-disable security/detect-child-process */
import { exec } from 'node:child_process'

import * as dotenv from 'dotenv'

import type { BaseOptions } from '@core/scripts/common'

const startCommand = (command: string) =>
    new Promise((resolve, reject) => {
        exec(command, (error, stdout) => {
            if (error) {
                reject(error)
                return
            }

            resolve(stdout)
        })
    })

export interface ResetOptions extends BaseOptions {
    project: string
    firestore?: boolean
    storage?: boolean
}

export default async ({
    env = 'dev',
    firestore = true,
    project,
    storage: includeStorage = true,
}: ResetOptions) => {
    const scope = env === 'dev' ? 'local' : env
    console.log(`Loading .env.${scope}`)
    dotenv.config({ path: `.env.${scope}` })

    const { getBucket } = await import('@core/services/firebaseAdmin')
    const { getStorage } = await import('@core/storage/firebase/admin')

    const storage = getStorage(getBucket())

    if (firestore) {
        // Clear firestore
        console.log(`Resetting ${project}...`)
        await startCommand(`firebase use ${project}`)
        await startCommand('firebase firestore:delete -f --all-collections')
    }

    if (includeStorage) {
        // Clear storage
        const files = await storage.getFiles()

        for (const file of files) {
            await storage.remove(file)
        }
    }
}
