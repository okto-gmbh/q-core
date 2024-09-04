import Image from 'next/legacy/image'

import { customImageLoader } from '../../utils/image'

import type { ImageProps } from 'next/legacy/image'

const LegacyImage = (props: ImageProps) => <Image loader={customImageLoader} {...props} />

export default LegacyImage
