import styled from '@emotion/styled'
import React from 'react'
import { from } from '../../../utils/breakpoints'
import { WrapperProps } from './Wrapper'

export const Element = styled(({ fluid: _fluid, ...rest }: WrapperProps) => (
    <div {...rest} />
))`
    width: ${({ fluid }) => (fluid ? '100%' : undefined)};
    max-width: ${({ fluid }) => (fluid ? undefined : 'var(--sizes-wrapper)')};
    padding-right: var(--spacings-default);
    padding-left: var(--spacings-default);
    margin-right: auto;
    margin-left: auto;

    @media ${from.tablet} {
        padding-right: var(--spacings-large);
        padding-left: var(--spacings-large);
    }
`
