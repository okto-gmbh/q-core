import { ComponentType, FC, HTMLAttributes } from 'react'

import { Breakpoints } from '../../../types'

import * as Styled from './Grid.styled'

export interface GridItemProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    span: number
    as?: string | ComponentType<any>
    breakpoints?: Breakpoints
    colHeight?: 'equal' | string
}

const GridItem: FC<GridItemProps> = (props) => <Styled.Item {...props} />

export default GridItem
