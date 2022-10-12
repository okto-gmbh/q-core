import { ButtonHTMLAttributes } from 'react'
import * as Styled from './Button.styled'
import React, { FC } from 'react'

export type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps
    extends Partial<ButtonHTMLAttributes<HTMLButtonElement>> {
    variant: ButtonVariant
    children: React.ReactNode
    endIcon?: React.ReactNode
}

const Button: FC<ButtonProps> = ({
    variant = 'primary',
    endIcon,
    children,
    ...props
}) => (
    <Styled.Button variant={variant} hasIcon={!!endIcon} {...props}>
        <span>{children}</span>
        {endIcon}
    </Styled.Button>
)

export default Button
