import type { ImageLoaderProps } from 'next/image'

export const customImageLoader = ({ quality, src, width }: ImageLoaderProps) =>
    src === '/placeholder.png'
        ? src
        : `/api/image?src=${encodeURIComponent(src)}&w=${encodeURIComponent(
              width
          )}&q=${encodeURIComponent(quality || 75)}`
