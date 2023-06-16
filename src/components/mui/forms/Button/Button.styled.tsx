import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Button, { buttonClasses } from '@mui/material/Button'

import { composeButtonVariants } from '../../../Button/Button.styled'

import type { ButtonVariant } from '../../../Button/Button'

import type { ButtonProps as MuiButtonProps } from '@mui/material/Button'

import type { ButtonProps } from './Button'

const muiVariants: {
    [key in ButtonVariant]: MuiButtonProps['variant']
} = {
    primary: 'contained',
    secondary: 'outlined'
}

export const Element = styled(
    ({ look: _look, variant, ...rest }: ButtonProps) => (
        <Button
            color={variant}
            variant={muiVariants[variant || '']}
            {...rest}
        />
    )
)`
    ${composeButtonVariants}

    && {
        padding: var(--_padding);
        border: var(--_border);
        border-radius: var(--_borderRadius);
        background-color: var(--_backgroundColor);
        box-shadow: var(--shadows-mui);
        color: var(--_color);
        font-weight: var(--fontWeights-default);
        letter-spacing: var(--_letterSpacing);
        white-space: nowrap;

        &:hover {
            border-color: var(--_borderColorHover);
            background-color: var(--_backgroundColorHover);
        }
    }

    &.${buttonClasses.containedPrimary} {
        background-color: var(--_backgroundColor);
    }

    &.${buttonClasses.outlinedSecondary} {
        border-radius: var(--_borderRadius);
    }

    ${({ look }: { look?: 'icon' }) =>
        look === 'icon' &&
        css`
            && {
                display: flex;
                width: 50px;
                min-width: 50px;
                max-width: 50px;
                height: 50px;
                min-height: 50px;
                max-height: 50px;
                box-sizing: border-box;
                align-items: center;
                justify-content: center;
                padding: 0;
                border-radius: 50;
            }
        `}
`
