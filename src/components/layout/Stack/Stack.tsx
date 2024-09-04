'use client'

import { forwardRef } from 'react'

import * as Styled from './Stack.styled'

import type { ComponentType, ForwardRefRenderFunction, HTMLAttributes } from 'react'

import type { AlignItems, Breakpoints, JustifyContent, Spacing } from '../../../types'

type Direction = 'horizontal' | 'vertical'

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
    alignItems?: AlignItems
    as?: ComponentType | string
    breakpoints?: Breakpoints
    direction?: Direction
    justifyContent?: JustifyContent
    spacing?: Spacing
}

const Stack: ForwardRefRenderFunction<HTMLDivElement, StackProps> = (
    { direction = 'vertical', spacing = 'default', ...props },
    ref
) => <Styled.Element direction={direction} ref={ref} spacing={spacing} {...props} />

export default forwardRef<HTMLDivElement, StackProps>(Stack)
