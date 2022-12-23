import type { NextApiRequest } from 'next/types'

export const getAppUrl = (req: NextApiRequest, fallback = 'localhost:3000') => {
    const host = req.headers['x-forwarded-host'] || req.headers.host || fallback
    const protocol = host.includes('localhost:') ? 'http' : 'https'

    return protocol + '://' + host
}
