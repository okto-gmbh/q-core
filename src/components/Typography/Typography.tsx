'use client'

import * as Styled from './Typography.styled'

import type { Display, FontSize, FontWeight } from '../../types'
import type { ComponentType, FC, HTMLAttributes } from 'react'

export interface TypographyProps
    extends Partial<HTMLAttributes<HTMLParagraphElement>> {
    as?: string | ComponentType<any>
    display?: Display
    fontSize?: FontSize
    fontWeight?: FontWeight
}

const Typography: FC<TypographyProps> = (props) => <Styled.Element {...props} />

export default Typography
