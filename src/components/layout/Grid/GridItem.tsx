import * as Styled from './Grid.styled'

import type { Breakpoints } from '../../../types'
import type { ComponentType, FC, HTMLAttributes } from 'react'

export interface GridItemProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    span: number
    as?: string | ComponentType<any>
    breakpoints?: Breakpoints
    colHeight?: 'equal' | string
}

const GridItem: FC<GridItemProps> = (props) => <Styled.Item {...props} />

export default GridItem
