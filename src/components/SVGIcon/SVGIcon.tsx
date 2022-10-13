import React, { FC, HTMLAttributes } from 'react'
import * as Styled from './SVGIcon.styled'

export type SVGIconSize =
    | 'tiny'
    | 'small'
    | 'medium'
    | 'default'
    | 'large'
    | 'huge'

export interface SVGIconProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    size: SVGIconSize
    children: React.ReactNode
}

const SVGIcon: FC<SVGIconProps> = ({ size = 'default', children }) => (
    <Styled.Container size={size}>{children}</Styled.Container>
)

export default SVGIcon
