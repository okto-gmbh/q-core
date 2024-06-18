'use client'

import { forwardRef } from 'react'

import * as Styled from './Paper.styled'

import type { ForwardedRef, HTMLAttributes } from 'react'

export interface PaperProps extends HTMLAttributes<HTMLDivElement> {
    borderRadius?: string
    height?: string
    overflow?: string
    scroll?: 'x' | 'y' | 'all'
    width?: string
}

const Paper = (props: PaperProps, ref: ForwardedRef<HTMLDivElement>) => (
    <Styled.Element {...props} ref={ref} />
)

export default forwardRef<HTMLDivElement, PaperProps>(Paper)
