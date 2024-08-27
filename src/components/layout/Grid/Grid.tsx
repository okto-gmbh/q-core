'use client'

import * as Styled from './Grid.styled'
import GridArea from './GridArea'
import GridItem from './GridItem'

import type { ComponentType, FC, HTMLAttributes } from 'react'

import type { AlignItems, JustifyContent, Spacing } from '../../../types'

export interface GridProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    alignItems?: AlignItems
    as?: ComponentType<any> | string
    colHeight?: 'equal' | string
    cols?: number
    gap?: Spacing
    justifyContent?: JustifyContent
}

const Grid: FC<GridProps> = (props) => <Styled.Grid {...props} />

export default Grid

export { GridArea, GridItem }
