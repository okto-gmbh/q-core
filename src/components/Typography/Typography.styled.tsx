import styled from '@emotion/styled'
import React from 'react'
import { TypographyProps } from './Typography'

export const Element = styled(
    ({
        as: Component = 'p',
        display: _display,
        fontSize: _fontSize,
        fontWeight: _fontWeight,
        ...rest
    }: TypographyProps) => <Component {...rest} />
)`
    display: ${({ display }) => display || 'block'};
    font-size: ${({ fontSize }) =>
        fontSize ? `var(--font-size-${fontSize}) ` : 'var(--font-size-default)'};
    font-weight: ${({ fontWeight }) => fontWeight};
    line-height: ${({ fontSize }) =>
        fontSize
            ? `var(--line-height-${fontSize}) `
            : 'var(--line-height-default)'};
`
