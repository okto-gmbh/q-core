import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React, { forwardRef, ForwardRefRenderFunction } from 'react'
import { from } from '../../../utils/breakpoints'
import { StackProps } from './Stack'

const StyledStack: ForwardRefRenderFunction<HTMLDivElement, StackProps> = (
    {
        as: Component = 'div',
        spacing: _spacing,
        direction: _direction,
        alignItems: _alignItems,
        justifyContent: _justifyContent,
        flexDirection: _flexDirection,
        children,
        ...rest
    },
    ref
) => React.createElement(Component, { ...rest, ref } as any, children)

export const Element = styled(
    forwardRef<HTMLDivElement, StackProps>(StyledStack)
)`
    width: 100%;

    ${({ flexDirection, direction, justifyContent, alignItems }) =>
        (direction === 'horizontal' ||
            flexDirection ||
            justifyContent ||
            alignItems) &&
        css`
            display: flex;
            justify-content: ${justifyContent};
            align-items: ${alignItems};
            flex-direction: ${direction === 'horizontal'
                ? 'row'
                : direction === 'vertical'
                ? 'column'
                : flexDirection};
        `}

    ${({ breakpoints }) =>
        breakpoints &&
        css`
            ${Object.entries(breakpoints)
                .map(
                    ([
                        breakpoint,
                        { flexDirection, direction, alignItems }
                    ]) => `
                            @media ${from[breakpoint]} {
                                ${
                                    (direction === 'horizontal' ||
                                        flexDirection) &&
                                    `
                                        display: flex;
                                        flex-direction: ${
                                            direction === 'horizontal'
                                                ? 'row'
                                                : flexDirection
                                        };
                                    `
                                }
                                ${
                                    alignItems &&
                                    `
                                        align-items: ${alignItems};
                                    `
                                }
                            }
                         `
                )
                .join('\n')}
        `}


    > * + * {
        ${({ breakpoints, spacing, direction, flexDirection }) => {
            const orientation = (direction?: string, flexDirection?: string) =>
                direction === 'horizontal' || flexDirection === 'row'
                    ? 'margin-left'
                    : 'margin-top'

            return css`
                ${orientation(
                    direction,
                    flexDirection
                )}: var(--spacings-${spacing});

                ${breakpoints &&
                Object.entries(breakpoints)
                    .map(
                        ([
                            breakpoint,
                            {
                                spacing: breakpointSpacing,
                                direction: breakpointDirection,
                                flexDirection
                            }
                        ]) => `
                            @media ${from[breakpoint]} {
                                margin-left: initial;
                                margin-top: initial;

                                ${orientation(
                                    breakpointDirection
                                        ? breakpointDirection
                                        : direction,
                                    flexDirection
                                )}: var(--spacings-${
                            breakpointSpacing ? breakpointSpacing : spacing
                        });
                            }
                        `
                    )
                    .join('\n')}
            `
        }}
    }
`
