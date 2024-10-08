import * as Styled from './SVGIcon.styled'

import type { FC, HTMLAttributes } from 'react'
import type React from 'react'

import type { Breakpoints } from '../../types'

export type SVGIconSize = 'default' | 'huge' | 'large' | 'medium' | 'small' | 'tiny'

export interface SVGIconProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    children: React.ReactNode
    size: SVGIconSize
    breakpoints?: Breakpoints
}

const SVGIcon: FC<SVGIconProps> = ({ children, size = 'default', ...props }) => (
    <Styled.Container size={size} {...props}>
        {children}
    </Styled.Container>
)

export default SVGIcon
