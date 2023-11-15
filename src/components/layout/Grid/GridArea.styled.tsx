import { css } from '@emotion/react'
import styled from '@emotion/styled'

import type { GridAreaProps } from './GridArea'

const mapChildren = (children: any[]) =>
    children.map(
        (_, index) => css`
            &:nth-child(${index + 1}) {
                grid-area: ${`a${index + 1}`};
            }
        `
    )

const mapAreas = (areas: Array<number[]>): string =>
    areas
        .reduce(
            (acc, currentValue) => acc.concat(`'a${currentValue.join(' a')}'`),
            [] as string[]
        )
        .join(' ')

export const Grid = styled(
    ({
        areas: _areas,
        as: Component = 'div',
        gapX: _gapX,
        gapY: _gapY,
        items: _items,
        ...rest
    }: GridAreaProps) => <Component {...rest} />
)`
    display: grid;
    column-gap: ${({ gapX }) => `var(--spacings-${gapX})`};
    row-gap: ${({ gapY }) => `var(--spacings-${gapY})`};
    grid-template-areas: ${({ areas }) => mapAreas(areas)};
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));

    align-items: start;

    ${({ items }) =>
        items &&
        css`
            > * {
                ${mapChildren(items)}
            }
        `}
`
