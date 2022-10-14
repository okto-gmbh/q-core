import React, { ButtonHTMLAttributes, FC } from 'react'
import Stack from '../layout/Stack'
import * as Styled from './Button.styled'

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
}) => {
    const withEndIcon = (
        <Stack alignItems="end" direction="horizontal" spacing="small">
            <span>{children}</span>
            <Styled.Icon>{endIcon}</Styled.Icon>
        </Stack>
    )

    return (
        <Styled.Button variant={variant} {...props}>
            {endIcon ? withEndIcon : children}
        </Styled.Button>
    )
}

export default Button
