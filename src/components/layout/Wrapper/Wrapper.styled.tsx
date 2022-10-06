import styled from '@emotion/styled'
import React from 'react'
import { WrapperProps } from './Wrapper'

export const Element = styled(({ fluid: _fluid, ...rest }: WrapperProps) => (
    <div {...rest} />
))`
    width: ${({ fluid }) => (fluid ? '100%' : undefined)};
    max-width: ${({ fluid }) =>
        fluid ? undefined : 'var(--wrapper-maxWidth)'};
    padding-right: var(--wrapper-paddingRight);
    padding-left: var(--wrapper-paddingLeft);
    margin-right: auto;
    margin-left: auto;
`
