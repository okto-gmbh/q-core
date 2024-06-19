'use client'

import * as Styled from './Wrapper.styled'

import type { FC, HTMLAttributes } from 'react'

export interface WrapperProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    fluid?: boolean
}

const Wrapper: FC<WrapperProps> = (props) => <Styled.Element {...props} />

export default Wrapper
