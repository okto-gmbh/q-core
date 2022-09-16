import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React, { forwardRef, ForwardRefRenderFunction } from 'react'
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
        ${({ spacing, direction }) => css`
            ${direction === 'vertical'
                ? 'margin-top'
                : 'margin-left'}: var(--spacings-${spacing});
        `}
    }
`
