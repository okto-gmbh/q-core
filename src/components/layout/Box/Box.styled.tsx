import React from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { BoxProps } from './Box'

export const Element = styled(
    ({
        as: Component = 'div',
        centered: _centered,
        display: _display,
        height: _height,
        flexDirection: _flexDirection,
        alignItems: _alignItems,
        justifyContent: _justifyContent,
        padding: _padding,
        textAlign: _textAlign,
        stretch: _stretch,
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
