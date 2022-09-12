import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React from 'react'
import { from, until } from '../../../utils/breakpoints'
import { GridProps } from './Grid'
import { GridItemProps } from './GridItem'

const GRID_COLS = 12

export const Grid = styled(
    ({
        as: Component = 'div',
        justifyContent: _justifyContent,
        alignItems: _alignItems,
        colHeight: _colHeight,
        gap: _gap,
        cols: _cols,
        ...rest
    }: GridProps) => <Component {...rest} />
)`
    display: grid;
    align-items: ${({ alignItems }) => alignItems || 'flex-start'};
    grid-gap: var(--spacings-${({ gap }) => gap || 'gap'}) 0;
    grid-template-columns: repeat(${GRID_COLS}, 1fr);

    @media ${from.tabletPortrait} {
        grid-gap: var(--spacings-${({ gap }) => gap || 'gap'});
    }

    img {
        width: 100%;
    }

    > :not(.pixls-grid-item) {
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
                @media ${from.mobileLandcape} {
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
                @media ${from.mobileLandcape} {
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
        span: _span,
        className = '',
        colHeight: _colHeight,
        breakpoints: _breakpoints,
        ...rest
    }: GridItemProps) => (
        <Component className={(className += ' pixls-grid-item')} {...rest} />
    )
)`
    width: 100%;

    ${({ breakpoints, span = 12 }) =>
        css`
            grid-column-end: span ${span};

            ${
                breakpoints &&
                Object.entries(breakpoints)
                    .map(
                        ([breakpoint, span]) => `
                        @media ${until[breakpoint]} {
                            grid-column-end: span ${span};
                        }`
                    )
                    .join('\n')
            }}
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
