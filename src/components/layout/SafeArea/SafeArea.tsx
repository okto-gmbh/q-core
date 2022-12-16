import React, { FC, HTMLAttributes } from 'react'

import * as Styled from './SafeArea.styled'

export interface SafeAreaProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    children: React.ReactNode
    bottom?: boolean
    left?: boolean
    right?: boolean
    top?: boolean
}

const SafeArea: FC<SafeAreaProps> = (props) => <Styled.SafeArea {...props} />

export default SafeArea
