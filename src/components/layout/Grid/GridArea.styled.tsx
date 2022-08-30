import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React from 'react'
import { GridAreaProps } from './GridArea'

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
        as: Component = 'div',
        areas: _areas,
        items: _items,
        gap: _gap,
        ...rest
    }: GridAreaProps) => <Component {...rest} />
)`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    grid-gap: ${({ gap }) => `var(--spacing-${gap}) `};
    grid-template-areas: ${({ areas }) => mapAreas(areas)};

    ${({ items }) =>
        items &&
        css`
            > * {
                ${mapChildren(items)}
            }
        `}
`
