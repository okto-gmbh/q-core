'use client'

import * as Styled from './Paper.styled'

import type { HTMLAttributes, Ref } from 'react'

export interface PaperProps extends HTMLAttributes<HTMLDivElement> {
    ref: Ref<HTMLDivElement>
    borderRadius?: string
    height?: string
    overflow?: string
    scroll?: 'all' | 'x' | 'y'
    width?: string
}

const Paper = (props: PaperProps) => <Styled.Element {...props} />

export default Paper
