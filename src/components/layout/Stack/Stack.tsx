import React, {
    ComponentType,
    forwardRef,
    ForwardRefRenderFunction,
    HTMLAttributes
} from 'react'
import {
    AlignItems,
    JustifyContent,
    Spacing,
    Breakpoints
} from '../../../types'
import * as Styled from './Stack.styled'

type Direction = 'vertical' | 'horizontal'

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
    as?: string | ComponentType
    spacing?: Spacing
    direction?: Direction
    alignItems?: AlignItems
    justifyContent?: JustifyContent
    breakpoints?: Breakpoints
}

const Stack: ForwardRefRenderFunction<HTMLDivElement, StackProps> = (
    { spacing = 'default', direction = 'vertical', ...props },
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
