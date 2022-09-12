import styled from '@emotion/styled'
import React from 'react'
import { from } from '../../../utils/breakpoints'
import { WrapperProps } from './Wrapper'

export const Element = styled(({ fluid: _fluid, ...rest }: WrapperProps) => (
    <div {...rest} />
))`
    width: ${({ fluid }) => (fluid ? '100%' : undefined)};
    max-width: ${({ fluid }) => (fluid ? undefined : 'var(--wrapper-width)')};
    padding-right: var(--spacing-default);
    padding-left: var(--spacing-default);
    margin-right: auto;
    margin-left: auto;

    @media ${from.tablet} {
        padding-right: var(--spacing-large);
        padding-left: var(--spacing-large);
    }
`
