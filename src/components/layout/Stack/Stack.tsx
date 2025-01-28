'use client'

import * as Styled from './Stack.styled'

import type { ComponentType, HTMLAttributes, Ref } from 'react'

import type { AlignItems, Breakpoints, JustifyContent, Spacing } from '../../../types'

type Direction = 'horizontal' | 'vertical'

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
    alignItems?: AlignItems
    as?: ComponentType | string
    breakpoints?: Breakpoints
    direction?: Direction
    justifyContent?: JustifyContent
    ref?: Ref<HTMLDivElement>
    spacing?: Spacing
}

const Stack = ({ direction = 'vertical', spacing = 'default', ...props }: StackProps) => (
    <Styled.Element direction={direction} spacing={spacing} {...props} />
)

export default Stack
