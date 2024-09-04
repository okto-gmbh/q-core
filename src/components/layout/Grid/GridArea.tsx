import * as Styled from './GridArea.styled'

import type { ComponentType, FC, HTMLAttributes } from 'react'

import type { Spacing } from '../../../types'

export interface GridAreaProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    areas: number[][]
    items: any[]
    as?: ComponentType<any> | string
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
