import * as Styled from './Grid.styled'

import type { ComponentType, FC, HTMLAttributes } from 'react'

import type { Breakpoints } from '../../../types'

export interface GridItemProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    span: number
    as?: ComponentType<any> | string
    breakpoints?: Breakpoints
    colHeight?: 'equal' | string
}

const GridItem: FC<GridItemProps> = (props) => <Styled.Item {...props} />

export default GridItem
