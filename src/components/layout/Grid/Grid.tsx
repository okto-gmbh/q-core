import React, { ComponentType, FC, HTMLAttributes } from 'react'
import { AlignItems, JustifyContent, Spacing } from '../../../types'
import * as Styled from './Grid.styled'
import GridArea from './GridArea'
import GridItem from './GridItem'

export interface GridProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    as?: string | ComponentType<any>
    justifyContent?: JustifyContent
    alignItems?: AlignItems
    gap?: Spacing
    colHeight?: 'equal' | string
    cols: number
}

const Grid: FC<GridProps> = (props) => <Styled.Grid {...props} />

export default Grid

export { GridItem, GridArea }
