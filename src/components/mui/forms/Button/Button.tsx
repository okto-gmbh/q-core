'use client'

import * as Styled from './Button.styled'

import type { ButtonProps as MuiButtonProps } from '@mui/material'
import type { FC } from 'react'

import type { ButtonVariant } from '../../../Button/Button'

export type ButtonProps = Omit<MuiButtonProps, 'variant'> & {
    variant: ButtonVariant
    look?: 'icon'
}

const Button: FC<ButtonProps> = ({ variant = 'primary', ...props }) => (
    <Styled.Element variant={variant} {...props} />
)

export default Button
