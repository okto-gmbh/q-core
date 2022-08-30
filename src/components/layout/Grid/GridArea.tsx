import React, { ComponentType, FC, HTMLAttributes } from 'react'
import { Spacing } from '../../../types'
import * as Styled from './GridArea.styled'

export interface GridAreaProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    as?: string | ComponentType<any>
    areas: number[][]
    items: any[]
    gap?: Spacing
}

const GridArea: FC<GridAreaProps> = ({
    children,
    areas,
    gap = 'default',
    ...props
}) => (
    <Styled.Grid
        {...props}
        areas={areas}
        gap={gap}
        items={[...new Array((children as any[]).length)]}>
        {children}
    </Styled.Grid>
)

export default GridArea
