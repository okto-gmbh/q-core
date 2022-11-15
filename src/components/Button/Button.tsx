import React, { ButtonHTMLAttributes, FC } from 'react'
import * as Styled from './Button.styled'

export type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps
    extends Partial<ButtonHTMLAttributes<HTMLButtonElement>> {
    variant: ButtonVariant
    children: React.ReactNode
    endIcon?: React.ReactNode
    startIcon?: React.ReactNode
    isFullwidth?: boolean
}

const Button: FC<ButtonProps> = ({
    variant = 'primary',
    endIcon,
    startIcon,
    children,
    isFullwidth,
    ...props
}) => {
    const withIcon = (
        <Styled.Stack alignItems="end" direction="horizontal" spacing="small">
            {startIcon && <Styled.Icon>{startIcon}</Styled.Icon>}
            <span>{children}</span>
            {endIcon && <Styled.Icon>{endIcon}</Styled.Icon>}
        </Styled.Stack>
    )

    return (
        <Styled.Button variant={variant} isFullwidth={isFullwidth} {...props}>
            {startIcon || endIcon ? withIcon : children}
        </Styled.Button>
    )
}

export default Button
