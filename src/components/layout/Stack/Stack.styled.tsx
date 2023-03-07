import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React, { forwardRef, ForwardRefRenderFunction } from 'react'

import { from } from '../../../utils/breakpoints'
import { getDirectionSpacing, getFlexDirection } from '../../../utils/styles'

import { StackProps } from './Stack'

const StyledStack: ForwardRefRenderFunction<HTMLDivElement, StackProps> = (
    {
        as: Component = 'div',
        spacing: _spacing,
        direction: _direction,
        alignItems: _alignItems,
        justifyContent: _justifyContent,
        children,
        ...rest
    },
    ref
) => React.createElement(Component, { ...rest, ref } as any, children)

export const Element = styled(
    forwardRef<HTMLDivElement, StackProps>(StyledStack)
)`
    width: 100%;

    ${({ direction, justifyContent, alignItems }) =>
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
                    ([breakpoint, { direction, alignItems }]) => `
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
        ${({ breakpoints, spacing, direction }) =>
            css`
                ${getDirectionSpacing(direction)}: var(--spacings-${spacing});

                ${breakpoints &&
                Object.entries(breakpoints)
                    .map(
                        ([
                            breakpoint,
                            {
                                spacing: breakpointSpacing,
                                direction: breakpointDirection
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
                            breakpointSpacing ? breakpointSpacing : spacing
                        });
                            }
                        `
                    )
                    .join('\n')}
            `}
    }
`
