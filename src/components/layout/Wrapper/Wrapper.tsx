import React, { FC, HTMLAttributes } from 'react'
import * as Styled from './Wrapper.styled'

export interface WrapperProps extends Partial<HTMLAttributes<HTMLDivElement>> {
    fluid?: boolean
}

const Wrapper: FC<WrapperProps> = (props) => <Styled.Element {...props} />

export default Wrapper
