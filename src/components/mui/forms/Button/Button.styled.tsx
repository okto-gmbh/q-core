import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Button, { buttonClasses } from '@mui/material/Button'
import React from 'react'
import { composeButtonVariants } from '../../../Button/Button.styled'
import { ButtonProps } from './Button'

export const Element = styled(
    ({ variant, look: _look, ...rest }: ButtonProps) => (
        <Button
            variant={
                variant === 'primary'
                    ? 'contained'
                    : variant === 'secondary'
                    ? 'outlined'
                    : undefined
            }
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
        padding: var(--spacings-small)
            calc(var(--spacings-large) - var(--spacings-small));
        letter-spacing: var(--_letterSpacing);
    }

    &.${buttonClasses.containedPrimary} {
        border: var(--_border);
        background-color: var(--_backgroundColor);

        &:hover {
            border-color: var(--_borderColorHover);
            background-color: var(--_backgroundColorHover);
        }
    }

    &.${buttonClasses.outlinedSecondary} {
        border-radius: var(--_borderRadius);
        border: var(--_border);
        background-color: var(--_backgroundColor);
        color: var(--_color);

        &:hover {
            border-color: var(--_borderColorHover);
            background-color: var(--_backgroundColorHover);
        }
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
