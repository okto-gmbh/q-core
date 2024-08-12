'use client'

import * as Styled from './Box.styled'

import type {
    AlignItems,
    Display,
    FlexDirection,
    JustifyContent,
    Spacing,
    TextAlign
} from '../../../types'
import type { ComponentType, FC, HTMLAttributes } from 'react'

export interface BoxProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    alignItems?: AlignItems
    as?: string | ComponentType<any>
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
