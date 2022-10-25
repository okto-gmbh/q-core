import { ButtonProps as MuiButtonProps } from '@mui/material'
import React, { FC } from 'react'
import { ButtonVariant } from '../../../Button/Button'
import * as Styled from './Button.styled'

export type ButtonProps = Omit<MuiButtonProps, 'variant'> & {
    variant: ButtonVariant
    look?: 'icon'
}

const Button: FC<ButtonProps> = ({ variant = 'primary', ...props }) => (
    <Styled.Element variant={variant} {...props} />
)

export default Button
