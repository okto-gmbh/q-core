'use client'

import * as Styled from './Typography.styled'

import type { ComponentType, FC, HTMLAttributes } from 'react'

import type { Display, FontSize, FontWeight } from '../../types'

export interface TypographyProps extends Partial<HTMLAttributes<HTMLParagraphElement>> {
    as?: ComponentType<any> | string
    display?: Display
    fontSize?: FontSize
    fontWeight?: FontWeight
}

const Typography: FC<TypographyProps> = (props) => <Styled.Element {...props} />

export default Typography
