import { ButtonProps as MuiButtonProps } from '@mui/material'
import React, { FC } from 'react'
import * as Styled from './Button.styled'

export type ButtonProps = {
    variant?: 'primary' | 'secondary'
    look?: 'icon'
} & MuiButtonProps

const Button: FC<ButtonProps> = ({ variant, ...props }) => (
    <Styled.Element color={variant} variant={variant} {...props} />
)

export default Button
