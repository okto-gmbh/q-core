import {
    ComponentType,
    forwardRef,
    ForwardRefRenderFunction,
    HTMLAttributes
} from 'react'

import {
    AlignItems,
    Breakpoints,
    FlexDirection,
    JustifyContent,
    Spacing
} from '../../../types'

import * as Styled from './Stack.styled'

type Direction = 'vertical' | 'horizontal'

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
    alignItems?: AlignItems
    as?: string | ComponentType
    breakpoints?: Breakpoints
    direction?: Direction
    flexDirection?: FlexDirection
    justifyContent?: JustifyContent
    spacing?: Spacing
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
