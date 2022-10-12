import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Button, {
    buttonClasses,
    ButtonProps as MuiButtonProps
} from '@mui/material/Button'
import React from 'react'
import { ButtonVariant } from '../../../Button/Button'
import { composeButtonVariants } from '../../../Button/Button.styled'
import { ButtonProps } from './Button'

const muiVariants: {
    [key in ButtonVariant]: MuiButtonProps['variant']
} = {
    primary: 'contained',
    secondary: 'outlined'
}

export const Element = styled(
    ({ variant, look: _look, ...rest }: ButtonProps) => (
        <Button
            color={variant}
            variant={muiVariants[variant || '']}
            {...rest}
        />
    )
)`
    ${composeButtonVariants}

    && {
        color: var(--_color);
        border-radius: var(--_borderRadius);
        box-shadow: var(--shadows-mui);
        font-weight: var(--fontWeights-default);
        white-space: nowrap;
        padding: var(--_padding);
        letter-spacing: var(--_letterSpacing);
        border: var(--_border);
        background-color: var(--_backgroundColor);

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
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                max-width: 50px;
                max-height: 50px;
                box-sizing: border-box;
                border-radius: 50;
                padding: 0;
                min-height: 50px;
                min-width: 50px;
            }
        `}
`
