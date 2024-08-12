'use client'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import type { BoxProps } from './Box'

export const Element = styled(
    ({
        alignItems: _alignItems,
        as: Component = 'div',
        centered: _centered,
        display: _display,
        flexDirection: _flexDirection,
        height: _height,
        justifyContent: _justifyContent,
        padding: _padding,
        stretch: _stretch,
        textAlign: _textAlign,
        ...rest
    }: BoxProps) => <Component {...rest} />
)`
    display: ${({ display }) => display || 'block'};
    width: 100%;
    height: ${({ height }) => height};
    flex-direction: ${({ flexDirection }) => flexDirection};
    align-items: ${({ alignItems }) => alignItems};
    justify-content: ${({ justifyContent }) => justifyContent};
    padding: ${({ padding }) => `var(--spacings-${padding}) `};
    text-align: ${({ textAlign }) => textAlign || 'left'};

    ${({ centered }) =>
        centered &&
        css`
            display: flex;
            height: 100%;
            align-items: center;
            justify-content: center;
        `}

    ${({ stretch }) =>
        stretch &&
        css`
            display: flex;

            > * {
                display: flex;
                align-items: center;
            }
        `}
`
