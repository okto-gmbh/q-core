import styled from '@emotion/styled'
import React from 'react'
import { from } from '../../utils/breakpoints'
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
    font-family: var(--font-heading);
    font-size: ${({ displayAs }) =>
        displayAs ? `var(--font-size-${displayAs}) ` : undefined};
    font-weight: ${({ displayAs }) =>
        displayAs
            ? `var(--font-weight-${displayAs}) `
            : 'var(--font-weight-600)'};

    letter-spacing: ${({ displayAs }) =>
        `var(--letter-spacing-${displayAs}-mobile) `};
    line-height: ${({ displayAs }) =>
        displayAs ? `var(--line-height-${displayAs}) ` : undefined};

    @media ${from.desktop} {
        letter-spacing: ${({ displayAs }) =>
            `var(--letter-spacing-${displayAs}-desktop) `};
    }
`
