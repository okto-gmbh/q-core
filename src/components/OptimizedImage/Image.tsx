import NextImage from 'next/image'

import { customImageLoader } from '../../utils/image'

import type { ImageProps } from 'next/image'

const Image = (props: ImageProps) => (
    <NextImage loader={customImageLoader} {...props} />
)

export default Image
