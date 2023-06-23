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
        gap: _gap,
        items: _items,
        ...rest
    }: GridAreaProps) => <Component {...rest} />
)`
    display: grid;
    grid-gap: ${({ gap }) => `var(--spacings-${gap}) `};
    grid-template-areas: ${({ areas }) => mapAreas(areas)};
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));

    ${({ items }) =>
        items &&
        css`
            > * {
                ${mapChildren(items)}
            }
        `}
`
