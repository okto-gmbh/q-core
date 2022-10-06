import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { ButtonProps } from './Button'

export const Button = styled('button')<ButtonProps>`
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;

    ${({ variant }) =>
        variant === 'primary'
            ? css`
                  padding-top: var(--button-primary-paddingTop);
                  padding-right: var(--button-primary-paddingRight);
                  padding-bottom: var(--button-primary-paddingBottom);
                  padding-left: var(--button-primary-paddingLeft);
                  border-style: var(--button-primary-borderStyle);
                  border-width: var(--button-primary-borderWidth);
                  border-radius: var(--button-primary-borderRadius);
                  border-color: var(--button-primary-borderColor);
                  letter-spacing: var(--button-primary-letterSpacing);
                  background-color: var(--button-primary-backgroundColor);
                  color: var(--button-primary-color);

                  &:hover {
                      background-color: var(
                          --button-primary-backgroundColorHover
                      );
                      border-color: var(--button-primary-borderColorHover);
                  }
              `
            : variant === 'secondary' &&
              css`
                  padding-top: var(--button-secondary-paddingTop);
                  padding-right: var(--button-secondary-paddingRight);
                  padding-bottom: var(--button-secondary-paddingBottom);
                  padding-left: var(--button-secondary-paddingLeft);
                  border-style: var(--button-secondary-borderStyle);
                  border-width: var(--button-secondary-borderWidth);
                  border-radius: var(--button-secondary-borderRadius);
                  border-color: var(--button-secondary-borderColor);
                  letter-spacing: var(--button-secondary-letterSpacing);
                  background-color: var(--button-secondary-backgroundColor);
                  color: var(--button-secondary-color);

                  &:hover {
                      background-color: var(
                          --button-secondary-backgroundColorHover
                      );
                      border-color: var(--button-secondary-borderColorHover);
                  }
              `}
`
