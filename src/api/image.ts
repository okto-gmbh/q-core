import sharp from 'sharp'

import type { NextApiRequest, NextApiResponse } from 'next'

export interface ImageOptimizerOptions {
    baseUrl: string
    maxAge?: number
}

const imageContentTypes = {
    avif: 'image/avif',
    svg: 'image/svg+xml',
    webp: 'image/webp'
}

const getImageType = (
    src: string,
    accept?: string
): keyof typeof imageContentTypes => {
    const supportsAvif = accept?.includes('image/avif')
    const isSvg = src.endsWith('.svg')

    return isSvg ? 'svg' : supportsAvif ? 'avif' : 'webp'
}

export const imageOptimizer =
    ({ baseUrl, maxAge = 31536000 }: ImageOptimizerOptions) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== 'GET') {
            res.status(405).send('Method not allowed')
            return
        }

        try {
            if (
                typeof req.query.src !== 'string' ||
                typeof req.query.w !== 'string' ||
                typeof req.query.q !== 'string'
            ) {
                res.status(400).send(
                    '400 Bad request: Required parameters missing'
                )
                return
            }

            const src = req.query.src
            const width = parseInt(req.query.w, 10)
            const quality = parseInt(req.query.q, 10)
            const imageType = getImageType(src, req.headers.accept)

            if (isNaN(width) || isNaN(quality)) {
                res.status(400).send('400 Bad request: Invalid parameters')
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
            if (imageType !== 'svg') {
                optimizedImage = await sharp(originalImage)
                    .resize({
                        width,
                        withoutEnlargement: true
                    })
                    [imageType]({ quality })
                    .toBuffer()
            }

            res.setHeader(
                'Cache-Control',
                `public, max-age=${maxAge}, must-revalidate`
            )
            res.setHeader('content-type', imageContentTypes[imageType])
            res.status(200).send(optimizedImage)
        } catch (e) {
            console.warn(e)
            res.status(500).send('500 Internal server error')
        }
    }
