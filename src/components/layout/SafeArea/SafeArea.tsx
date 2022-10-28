import React, { FC, HTMLAttributes } from 'react'
import * as Styled from './SafeArea.styled'

export interface SafeAreaProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    top?: boolean
    right?: boolean
    bottom?: boolean
    left?: boolean
    children: React.ReactNode
}

const SafeArea: FC<SafeAreaProps> = (props) => <Styled.SafeArea {...props} />

export default SafeArea
