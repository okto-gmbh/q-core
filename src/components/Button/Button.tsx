import React, { ButtonHTMLAttributes, FC } from 'react'
import Stack from '../layout/Stack'
import * as Styled from './Button.styled'

export type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps
    extends Partial<ButtonHTMLAttributes<HTMLButtonElement>> {
    variant: ButtonVariant
    children: React.ReactNode
    endIcon?: React.ReactNode
    startIcon?: React.ReactNode
    width?: string
    height?: string
}

const Button: FC<ButtonProps> = ({
    variant = 'primary',
    endIcon,
    startIcon,
    children,
    width,
    height,
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
        <Styled.Button
            variant={variant}
            width={width}
            height={height}
            {...props}>
            {startIcon || endIcon ? withIcon : children}
        </Styled.Button>
    )
}

export default Button
