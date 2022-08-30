import React, { ComponentType, FC, HTMLAttributes } from 'react'
import * as Styled from './Grid.styled'

export interface GridItemProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    as?: string | ComponentType<any>
    colHeight?: 'equal' | string
    span: number
    breakpoints?: {
        mobile?: number
        mobileL?: number
        tabletS?: number
        tablet?: number
        desktop?: number
        wide?: number
        megaWide?: number
        ultraWide?: number
    }
}

const GridItem: FC<GridItemProps> = (props) => <Styled.Item {...props} />

export default GridItem
