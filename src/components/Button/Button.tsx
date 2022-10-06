import { ButtonHTMLAttributes } from 'react'
import * as Styled from './Button.styled'
import React, { FC } from 'react'

export interface ButtonProps
    extends Partial<ButtonHTMLAttributes<HTMLButtonElement>> {
    variant: 'primary' | 'secondary'
    children: React.ReactNode
}

const Button: FC<ButtonProps> = ({ variant, children, ...props }) => (
    <Styled.Button variant={variant} {...props}>
        {children}
    </Styled.Button>
)

export default Button
