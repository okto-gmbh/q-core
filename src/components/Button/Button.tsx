import { ButtonHTMLAttributes } from 'react'
import * as Styled from './Button.styled'
import React, { FC } from 'react'

export type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps
    extends Partial<ButtonHTMLAttributes<HTMLButtonElement>> {
    variant: ButtonVariant
    children: React.ReactNode
}

const Button: FC<ButtonProps> = ({ variant = 'primary', ...props }) => (
    <Styled.Button variant={variant} {...props} />
)

export default Button
