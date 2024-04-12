import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React, { forwardRef } from 'react'

import { from } from '../../../utils/breakpoints'
import { getDirectionSpacing, getFlexDirection } from '../../../utils/styles'

import type { ForwardRefRenderFunction } from 'react'

import type { StackProps } from './Stack'

const StyledStack: ForwardRefRenderFunction<HTMLDivElement, StackProps> = (
    {
        alignItems: _alignItems,
        as: Component = 'div',
        children,
        direction: _direction,
        justifyContent: _justifyContent,
        spacing: _spacing,
        ...rest
    },
    ref
) => React.createElement(Component, { ...rest, ref } as any, children)

export const Element = styled(
    forwardRef<HTMLDivElement, StackProps>(StyledStack)
)`
    width: 100%;

    ${({ alignItems, direction, justifyContent }) =>
        (direction === 'horizontal' || justifyContent || alignItems) &&
        css`
            display: flex;
            justify-content: ${justifyContent};
            align-items: ${alignItems};
            flex-direction: ${getFlexDirection(direction)};
        `}

    ${({ breakpoints }) =>
        breakpoints &&
        css`
            ${Object.entries(breakpoints)
                .map(
                    ([breakpoint, { alignItems, direction }]) => `
                            @media ${from[breakpoint]} {
                                ${
                                    (direction || alignItems) &&
                                    `
                                        display: flex;
                                        align-items: ${alignItems};
                                        flex-direction: ${getFlexDirection(
                                            direction
                                        )};
                                    `
                                }
                            }
                         `
                )
                .join('\n')}
        `}


    > * + * {
        ${({ breakpoints, direction, spacing }) => css`
            ${getDirectionSpacing(direction)}: var(--spacings-${spacing});

            ${breakpoints &&
            Object.entries(breakpoints)
                .map(
                    ([
                        breakpoint,
                        {
                            direction: breakpointDirection,
                            spacing: breakpointSpacing
                        }
                    ]) => `
                            @media ${from[breakpoint]} {
                                margin-left: initial;
                                margin-top: initial;

                                ${getDirectionSpacing(
                                    breakpointDirection
                                        ? breakpointDirection
                                        : direction
                                )}: var(--spacings-${
                                    breakpointSpacing
                                        ? breakpointSpacing
                                        : spacing
                                });
                            }
                        `
                )
                .join('\n')}
        `}
    }
`
