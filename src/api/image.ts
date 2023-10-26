import sharp from 'sharp'

import type { NextApiRequest, NextApiResponse } from 'next'

export interface ImageOptimizerOptions {
    baseUrl: string
    maxAge?: number
}

export const imageOptimizer =
    ({ baseUrl, maxAge = 31536000 }: ImageOptimizerOptions) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'GET') {
            res.status(405).send('Method not allowed')
            return
        }

        try {
            const src = req.query.src as string
            const width = parseInt(req.query.w as string, 10)
            const quality = parseInt(req.query.q as string, 10)
            const isSvg = src.endsWith('.svg')

            if (!src || !width || !quality) {
                res.status(400).send(
                    '400 Bad request: Required parameters missing'
                )
                return
            }

            const response = await fetch(
                src.startsWith('http') ? src : `${baseUrl}/${src}`,
                {
                    credentials:
                        process.env.VERCEL_ENV === 'preview'
                            ? 'include'
                            : 'same-origin',
                    headers: {
                        cookie: req.headers.cookie!
                    }
                }
            )
            const originalImage = await response.arrayBuffer()

            let optimizedImage = Buffer.from(originalImage)
            if (!isSvg) {
                optimizedImage = await sharp(originalImage)
                    .resize({
                        width,
                        withoutEnlargement: true
                    })
                    .webp({ quality })
                    .toBuffer()
            }

            res.setHeader(
                'Cache-Control',
                `public, max-age=${maxAge}, must-revalidate`
            )
            res.setHeader(
                'content-type',
                isSvg ? 'image/svg+xml' : 'image/webp'
            )
            res.status(200).send(optimizedImage)
        } catch (e) {
            console.warn(e)
            res.status(500).send('500 Internal server error')
        }
    }
