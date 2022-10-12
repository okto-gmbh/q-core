import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { ButtonVariant } from './Button'

export const composeButtonVariants = ({
    variant = 'primary'
}: {
    variant: ButtonVariant
}) => {
    const namespace = `--button-${variant}`
    const isPrimary = variant === 'primary'
    const color = isPrimary ? 'white' : 'black'

    return css`
        --_padding: var(${namespace}-paddingX, var(--spacings-small, 12px))
            var(${namespace}-paddingY, var(--spacings-tiny, 6px));
        --_letterSpacing: var(
            ${namespace}-letterSpacing,
            var(--letterSpacings-default, 0)
        );
        --_borderRadius: var(
            ${namespace}-borderRadius,
            var(--radii-default, 0)
        );
        --_border: var(
                ${namespace}-borderWidth,
                var(--borders-default-width, 0)
            )
            var(${namespace}-borderColor, var(--colors-${variant}, ${color}))
            var(${namespace}-borderStyle, var(--borders-default-style, solid));
        --_color: var(${namespace}-color, var(--colors-${color}, ${color}));
        --_backgroundColor: var(
            ${namespace}-backgroundColor,
            var(--colors-${variant}, ${color})
        );
        --_backgroundColorHover: var(
            ${namespace}-hover-backgroundColor,
            var(--colors-${variant}Hover, ${color})
        );
        --_borderColorHover: var(
            ${namespace}-hover-backgroundColor,
            var(--colors-${variant}Hover, ${color})
        );
        --_transition: var(
            ${namespace}-transition,
            all var(--motion-default, 0.2s ease-in-out)
        );
    `
}

export const Button = styled('button')`
    ${composeButtonVariants}

    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
    cursor: pointer;

    padding: var(--_padding);
    border: var(--_border);
    border-radius: var(--_borderRadius);
    letter-spacing: var(--_letterSpacing);
    background-color: var(--_backgroundColor);
    color: var(--_color);
    transition: var(--_transition);

    &:hover {
        background-color: var(--_backgroundColorHover);
        border-color: var(--_borderColorHover);
    }
`
