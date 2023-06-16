import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { from } from '../../../utils/breakpoints'

import type { GridProps } from './Grid'
import type { GridItemProps } from './GridItem'

const GRID_COLS = 12
export const GRID_ITEM_CLASS = 'pixls-grid-item'

export const Grid = styled(
    ({
        alignItems: _alignItems,
        as: Component = 'div',
        colHeight: _colHeight,
        cols: _cols,
        gap: _gap,
        justifyContent: _justifyContent,
        ...rest
    }: GridProps) => <Component {...rest} />
)`
    --_gap: var(--grid-gap, var(--spacings-default, 24px));

    display: grid;
    align-items: ${({ alignItems }) => alignItems || 'flex-start'};
    grid-gap: ${({ gap }) =>
        gap ? `var(--spacings-${gap}) 0` : 'var(--_gap) 0'};
    grid-template-columns: repeat(${GRID_COLS}, 1fr);

    @media ${from.tabletPortrait} {
        grid-gap: ${({ gap }) =>
            gap ? `var(--spacings-${gap}) ` : 'var(--_gap)'};
    }

    img {
        width: 100%;
    }

    > :not(.${GRID_ITEM_CLASS}) {
        width: 100%;

        grid-column-end: span ${GRID_COLS};

        ${({ cols }) =>
            cols === 2 &&
            css`
                @media ${from.tabletPortrait} {
                    grid-column-end: span 6;
                }
            `}

        ${({ cols }) =>
            cols === 3 &&
            css`
                @media ${from.tabletPortrait} {
                    grid-column-end: span 6;
                }

                @media ${from.desktopS} {
                    grid-column-end: span 4;
                }
            `}

        ${({ cols }) =>
            cols === 4 &&
            css`
                @media ${from.tabletPortrait} {
                    grid-column-end: span 6;
                }

                @media ${from.desktopS} {
                    grid-column-end: span 4;
                }

                @media ${from.desktopM} {
                    grid-column-end: span 3;
                }
            `}


        ${({ cols }) =>
            cols === 6 &&
            css`
                @media ${from.tabletPortrait} {
                    grid-column-end: span 6;
                }

                @media ${from.tabletLandscape} {
                    grid-column-end: span 4;
                }

                @media ${from.desktopS} {
                    grid-column-end: span 3;
                }

                @media ${from.desktopM} {
                    grid-column-end: span 2;
                }
            `}

        ${({ colHeight }) =>
            colHeight === 'equal'
                ? css`
                      height: 100%;
                  `
                : colHeight
                ? css`
                      height: ${colHeight};
                  `
                : undefined}
    }
`

export const Item = styled(
    ({
        as: Component = 'div',
        breakpoints: _breakpoints,
        className = '',
        colHeight: _colHeight,
        span: _span,
        ...rest
    }: GridItemProps) => (
        <Component className={(className += ` ${GRID_ITEM_CLASS}`)} {...rest} />
    )
)`
    width: 100%;

    ${({ breakpoints, span = 12 }) =>
        css`
            grid-column-end: span ${span};

            ${breakpoints &&
            Object.entries(breakpoints)
                .map(
                    ([breakpoint, { span }]) =>
                        span &&
                        `
                        @media ${from[breakpoint]} {
                            grid-column-end: span ${span};
                        }
                    `
                )
                .join('\n')}
        `}

    ${({ colHeight }) =>
        colHeight === 'equal'
            ? css`
                  height: 100%;
              `
            : colHeight
            ? css`
                  height: ${colHeight};
              `
            : undefined}

    img {
        width: 100%;
    }
`
