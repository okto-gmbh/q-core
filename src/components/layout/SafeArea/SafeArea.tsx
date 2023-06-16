import * as Styled from './SafeArea.styled'

import type { FC, HTMLAttributes } from 'react'
import type React from 'react'

export interface SafeAreaProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    children: React.ReactNode
    bottom?: boolean
    left?: boolean
    right?: boolean
    top?: boolean
}

const SafeArea: FC<SafeAreaProps> = (props) => <Styled.SafeArea {...props} />

export default SafeArea
