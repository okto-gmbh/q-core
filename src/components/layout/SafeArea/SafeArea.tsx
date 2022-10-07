import React, { FC, HTMLAttributes } from 'react'
import * as Styled from './SafeArea.styled'

export interface SafeAreaProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    paddings: {
        top?: boolean
        right?: boolean
        bottom?: boolean
        left?: boolean
    }
    children: React.ReactNode
}

const SafeArea: FC<SafeAreaProps> = ({ children, ...props }) => {
    return <Styled.SafeArea {...props}>{children}</Styled.SafeArea>
}

export default SafeArea
