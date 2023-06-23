import styled from '@emotion/styled'

import type { TypographyProps } from './Typography'

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
        fontSize
            ? `var(--fontSizes-${fontSize}) `
            : 'var(--fontSizes-default)'};
    font-weight: ${({ fontWeight }) => fontWeight};
    line-height: ${({ fontSize }) =>
        fontSize
            ? `var(--lineHeights-${fontSize}) `
            : 'var(--lineHeights-default)'};
`
