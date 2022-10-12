import { ButtonHTMLAttributes } from 'react'
import * as Styled from './Button.styled'
import React, { FC } from 'react'

export interface ButtonProps
    extends Partial<ButtonHTMLAttributes<HTMLButtonElement>> {
    variant: 'primary' | 'secondary'
    children: React.ReactNode
}

const Button: FC<ButtonProps> = (props) => <Styled.Button {...props} />

export default Button
