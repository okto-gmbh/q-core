'use client'

import * as Styled from './Box.styled'

import type { ComponentType, FC, HTMLAttributes } from 'react'

import type {
    AlignItems,
    Display,
    FlexDirection,
    JustifyContent,
    Spacing,
    TextAlign,
} from '../../../types'

export interface BoxProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    alignItems?: AlignItems
    as?: ComponentType<any> | string
    centered?: boolean
    display?: Display
    flexDirection?: FlexDirection
    height?: string
    justifyContent?: JustifyContent
    padding?: Spacing
    stretch?: boolean
    textAlign?: TextAlign
}

const Box: FC<BoxProps> = (props) => <Styled.Element {...props} />

export default Box
