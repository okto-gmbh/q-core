import React from 'react'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Button, { buttonClasses } from '@mui/material/Button'
import { ButtonProps } from './Button'
import { from } from '../../../../utils/breakpoints'

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
        color: var(--colors-white);
        border-radius: var(--radii-default);
        box-shadow: var(--shadows-mui);
        font-weight: var(--fontWeights-default);
        white-space: nowrap;
        padding: var(--spacings-small)
            calc(var(--spacings-large) - var(--spacings-small));
        letter-spacing: var(--letterSpacings-button-mobile);

        @media ${from.desktop} {
            letter-spacing: var(--letterSpacings-button-desktop);
        }
    }

    &.${buttonClasses.containedPrimary} {
        border-color: var(--colors-primary);
        background-color: var(--colors-primary);

        &:hover {
            background-color: var(--colors-primaryHover);
        }
    }

    &.${buttonClasses.outlinedSecondary} {
        border-color: var(--colors-white);
        background-color: var(--colors-white);
        color: var(--colors-black);

        &:hover {
            background-color: var(--colors-gray-90);
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
