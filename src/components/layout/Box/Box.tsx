import React, { ComponentType, FC, HTMLAttributes } from 'react'
import {
    AlignItems,
    Display,
    FlexDirection,
    JustifyContent,
    Spacing,
    TextAlign
} from '../../../types'
import * as Styled from './Box.styled'

export interface BoxProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    as?: string | ComponentType<any>
    padding?: Spacing
    centered?: boolean
    display?: Display
    height?: string
    flexDirection?: FlexDirection
    alignItems?: AlignItems
    justifyContent?: JustifyContent
    textAlign?: TextAlign
    stretch?: boolean
}

const Box: FC<BoxProps> = (props) => <Styled.Element {...props} />

export default Box
