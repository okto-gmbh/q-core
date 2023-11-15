import * as Styled from './GridArea.styled'

import type { Spacing } from '../../../types'
import type { ComponentType, FC, HTMLAttributes } from 'react'

export interface GridAreaProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    areas: number[][]
    items: any[]
    as?: string | ComponentType<any>
    gap?: Spacing
    gapX?: Spacing
    gapY?: Spacing
}

const GridArea: FC<GridAreaProps> = ({
    areas,
    children,
    gap = 'default',
    gapX = gap,
    gapY = gap,
    ...props
}) => (
    <Styled.Grid
        {...props}
        areas={areas}
        gapX={gapX}
        gapY={gapY}
        items={[...new Array((children as any[]).length)]}>
        {children}
    </Styled.Grid>
)

export default GridArea
