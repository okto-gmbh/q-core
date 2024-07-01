'use client'

import GridArea from './GridArea'
import GridItem from './GridItem'

import * as Styled from './Grid.styled'

import type { AlignItems, JustifyContent, Spacing } from '../../../types'
import type { ComponentType, FC, HTMLAttributes } from 'react'

export interface GridProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    alignItems?: AlignItems
    as?: string | ComponentType<any>
    colHeight?: 'equal' | string
    cols?: number
    gap?: Spacing
    justifyContent?: JustifyContent
}

const Grid: FC<GridProps> = (props) => <Styled.Grid {...props} />

export default Grid

export { GridArea, GridItem }
