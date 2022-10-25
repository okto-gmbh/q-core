import React, { FC, HTMLAttributes } from 'react'
import { Breakpoints } from '../../types'
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
    breakpoints?: Breakpoints
}

const SVGIcon: FC<SVGIconProps> = ({
    size = 'default',
    children,
    ...props
}) => (
    <Styled.Container size={size} {...props}>
        {children}
    </Styled.Container>
)

export default SVGIcon
