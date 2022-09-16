import styled from '@emotion/styled'
import React, { ForwardedRef, forwardRef } from 'react'
import { PaperProps } from '.'

const StyledPaper = (
    {
        borderRadius: _borderRadius,
        width: _width,
        height: _height,
        overflow: _overflow,
        scroll: _scroll,
        ...rest
    }: PaperProps,
    ref: ForwardedRef<HTMLDivElement>
) => <div {...rest} ref={ref} />

export const Element = styled(forwardRef(StyledPaper))`
    position: relative;
    box-shadow: var(--shadows-mui);
    border-radius: ${({ borderRadius }) =>
        borderRadius ? borderRadius : 'var(--radii-default)'};
    width: ${({ width }) => (width ? width : 'auto')};
    background-color: var(--colors-white);
    overflow: ${({ overflow }) => (overflow ? overflow : 'hidden')};
    overflow-x: ${({ scroll }) =>
        scroll === 'x' || scroll === 'all' ? 'auto' : undefined};
    overflow-y: ${({ scroll }) =>
        scroll === 'y' || scroll === 'all' ? 'auto' : undefined};
    height: ${({ height }) => (height ? height : undefined)};
`
