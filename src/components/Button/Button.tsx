import Stack from '../layout/Stack'
import * as Styled from './Button.styled'

import type { ButtonHTMLAttributes, FC } from 'react'
import type React from 'react'

export type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps extends Partial<ButtonHTMLAttributes<HTMLButtonElement>> {
    children: React.ReactNode
    variant: ButtonVariant
    endIcon?: React.ReactNode
    height?: string
    startIcon?: React.ReactNode
    width?: string
}

const Button: FC<ButtonProps> = ({
    children,
    endIcon,
    startIcon,
    variant = 'primary',
    ...props
}) => {
    const withIcon = (
        <Stack alignItems="center" direction="horizontal" justifyContent="center" spacing="small">
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
