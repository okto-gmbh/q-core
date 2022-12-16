import styled from '@emotion/styled'

import { HeadingProps } from './Heading'

export const Element = styled(
    ({
        as: ComponentOverride,
        displayAs: Component,
        ...rest
    }: HeadingProps) => {
        if (ComponentOverride) {
            return <ComponentOverride {...rest} />
        }
        return <Component {...rest} />
    }
)`
    font-family: var(--fonts-heading);
    font-size: ${({ displayAs }) =>
        displayAs ? `var(--fontSizes-${displayAs}) ` : undefined};
    font-weight: ${({ displayAs }) =>
        displayAs
            ? `var(--fontWeights-${displayAs}) `
            : 'var(--fontWeights-600)'};

    letter-spacing: ${({ displayAs }) => `var(--letterSpacings-${displayAs}) `};
    line-height: ${({ displayAs }) =>
        displayAs ? `var(--lineHeights-${displayAs}) ` : undefined};
`
