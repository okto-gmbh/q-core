'use client'

import * as Styled from './Paper.styled'

import type { HTMLAttributes, Ref } from 'react'

export interface PaperProps extends HTMLAttributes<HTMLDivElement> {
    ref: Ref<HTMLDivElement>
    borderRadius?: string
    height?: string
    overflow?: string
    ownerState?: unknown
    scroll?: 'all' | 'x' | 'y'
    width?: string
}

const Paper = ({ ownerState: _, ...props }: PaperProps) => <Styled.Element {...props} />

export default Paper
