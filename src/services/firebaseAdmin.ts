import {
    cert,
    getApp as adminGetApp,
    getApps,
    initializeApp as adminInitializeApp
} from 'firebase-admin/app'
import { getAuth as adminGetAuth } from 'firebase-admin/auth'
import { getFirestore as adminGetFirestore } from 'firebase-admin/firestore'
import { getStorage as adminGetStorage } from 'firebase-admin/storage'

import type { App, ServiceAccount } from 'firebase-admin/app'

export const initializeApp = (config = process.env, appName = 'default') => {
    if (getApps().filter((app) => app.name === appName).length > 0) {
        return adminGetApp(appName)
    }
    return adminInitializeApp(
        {
            credential: cert({
                auth_provider_x509_cert_url:
                    config.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
                auth_uri: config.FIREBASE_ADMIN_AUTH_URI,
                client_email: config.FIREBASE_ADMIN_CLIENT_EMAIL,
                client_id: config.FIREBASE_ADMIN_CLIENT_ID,
                client_x509_cert_url:
                    config.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
                databaseURL: config.FIREBASE_DATABASE_URL,
                private_key: config.FIREBASE_ADMIN_PRIVATE_KEY!.replace(
                    /\\n/g,
                    '\n'
                ),
                private_key_id: config.FIREBASE_ADMIN_PRIVATE_KEY_ID,
                project_id: config.FIREBASE_ADMIN_PROJECT_ID,
                token_uri: config.FIREBASE_ADMIN_TOKEN_URI,
                type: config.FIREBASE_ADMIN_TYPE
            } as ServiceAccount)
        },
        appName
    )
}

if (process.env.NODE_ENV === 'test' || process.env.NEXT_PUBLIC_EMULATOR) {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099'
    process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080'
    process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9199'
}

export const getApp = (appName = 'default'): App => {
    if (getApps().length === 0) {
        return initializeApp(undefined, appName)
    }
    return adminGetApp(appName)
}

export const getDB = (app?: App) => {
    app = app ?? getApp()
    return adminGetFirestore(app)
}

export const getAuth = (app?: App) => {
    app = app ?? getApp()
    return adminGetAuth(app)
}

export const getStorage = (app?: App) => {
    app = app ?? getApp()
    return adminGetStorage(app)
}

export const getBucket = (app?: App) =>
    getStorage(app).bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)

export const getFirestore = (app?: App) => {
    app = app ?? getApp()
    return adminGetFirestore(app)
}
