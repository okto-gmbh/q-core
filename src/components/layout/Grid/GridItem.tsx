import React, { ComponentType, FC, HTMLAttributes } from 'react'
import { Breakpoints } from '../../../types'
import * as Styled from './Grid.styled'

export interface GridItemProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    as?: string | ComponentType<any>
    colHeight?: 'equal' | string
    span: number
    breakpoints?: Breakpoints
}

const GridItem: FC<GridItemProps> = (props) => <Styled.Item {...props} />

export default GridItem
