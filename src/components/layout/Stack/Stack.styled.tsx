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
    flex-direction: ${({ flexDirection }) =>
        flexDirection ? flexDirection : undefined};

    ${({ justifyContent }) =>
        justifyContent &&
        css`
            display: flex;
            justify-content: ${justifyContent};
        `}

    ${({ alignItems }) =>
        alignItems &&
        css`
            display: flex;
            align-items: ${alignItems};
        `}

    > * + * {
        ${({ breakpoints, spacing, direction }) => {
            const orientation =
                direction === 'vertical' ? 'margin-top' : 'margin-left'

            return css`
                ${orientation}: var(--spacings-${spacing});

                ${breakpoints &&
                Object.entries(breakpoints)
                    .map(
                        ([breakpoint, { spacing }]) =>
                            spacing &&
                            `
                            @media ${from[breakpoint]} {
                                ${orientation}: var(--spacings-${spacing});
                            }
                        `
                    )
                    .join('\n')}
            `
        }}
    }
`
