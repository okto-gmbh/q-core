import styled from '@emotion/styled'
import React from 'react'
import { WrapperProps } from './Wrapper'

export const Element = styled(({ fluid: _fluid, ...rest }: WrapperProps) => (
    <div {...rest} />
))`
    --_maxWidth: var(--wrapper-maxWidth, 1600px);
    --_padding: 0 var(--wrapper-padding, var(--spacings-default, 24px));
    --_height: var(--wrapper-height, initial);

    width: ${({ fluid }) => (fluid ? '100%' : undefined)};
    height: var(--_height);
    max-width: ${({ fluid }) => (fluid ? undefined : 'var(--_maxWidth)')};
    padding: var(--_padding);
    margin-right: auto;
    margin-left: auto;
`
