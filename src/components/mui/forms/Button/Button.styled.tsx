import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Button, { buttonClasses } from '@mui/material/Button'
import React from 'react'
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
    && {
        color: var(--button-primary-color);
        border-radius: var(--button-primary-borderRadius);
        box-shadow: var(--shadows-mui);
        font-weight: var(--fontWeights-default);
        white-space: nowrap;
        padding: var(--spacings-small)
            calc(var(--spacings-large) - var(--spacings-small));
        letter-spacing: var(--button-primary-letterSpacing);
    }

    &.${buttonClasses.containedPrimary} {
        border-color: var(--button-primary-borderColor);
        background-color: var(--button-primary-backgroundColor);

        &:hover {
            border-color: var(--button-primary-borderColorHover);
            background-color: var(--button-primary-backgroundColorHover);
        }
    }

    &.${buttonClasses.outlinedSecondary} {
        border-radius: var(--button-secondary-borderRadius);
        border-color: var(--button-secondary-borderColor);
        background-color: var(--button-secondary-backgroundColor);
        color: var(--button-secondary-color);

        &:hover {
            border-color: var(--button-secondary-borderColorHover);
            background-color: var(--button-secondary-backgroundColorHover);
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
