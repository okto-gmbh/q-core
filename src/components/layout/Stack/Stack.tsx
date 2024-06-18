'use client'

import { forwardRef } from 'react'

import * as Styled from './Stack.styled'

import type {
    AlignItems,
    Breakpoints,
    JustifyContent,
    Spacing
} from '../../../types'
import type {
    ComponentType,
    ForwardRefRenderFunction,
    HTMLAttributes
} from 'react'

type Direction = 'vertical' | 'horizontal'

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
    alignItems?: AlignItems
    as?: string | ComponentType
    breakpoints?: Breakpoints
    direction?: Direction
    justifyContent?: JustifyContent
    spacing?: Spacing
}

const Stack: ForwardRefRenderFunction<HTMLDivElement, StackProps> = (
    { direction = 'vertical', spacing = 'default', ...props },
    ref
) => (
    <Styled.Element
        ref={ref}
        direction={direction as Direction}
        spacing={spacing as Spacing}
        {...props}
    />
)

export default forwardRef<HTMLDivElement, StackProps>(Stack)
