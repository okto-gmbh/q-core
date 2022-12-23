import React, { ButtonHTMLAttributes, FC } from 'react'

import Stack from '../layout/Stack'

import * as Styled from './Button.styled'

export type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps
    extends Partial<ButtonHTMLAttributes<HTMLButtonElement>> {
    children: React.ReactNode
    variant: ButtonVariant
    endIcon?: React.ReactNode
    height?: string
    startIcon?: React.ReactNode
    width?: string
}

const Button: FC<ButtonProps> = ({
    variant = 'primary',
    endIcon,
    startIcon,
    children,
    ...props
}) => {
    const withIcon = (
        <Stack
            alignItems="center"
            direction="horizontal"
            spacing="small"
            justifyContent="center">
            {startIcon && <Styled.Icon>{startIcon}</Styled.Icon>}
            <span>{children}</span>
            {endIcon && <Styled.Icon>{endIcon}</Styled.Icon>}
        </Stack>
    )

    return (
        <Styled.Button variant={variant} {...props}>
            {startIcon || endIcon ? withIcon : children}
        </Styled.Button>
    )
}

export default Button
