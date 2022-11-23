import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React from 'react'
import { ButtonProps, ButtonVariant } from './Button'

export const composeButtonVariants = ({
    variant = 'primary'
}: {
    variant: ButtonVariant
}) => {
    const namespace = `--button`
    const namespaceWithVariant = `${namespace}-${variant}`
    const isPrimary = variant === 'primary'
    const color = isPrimary ? 'white' : 'black'

    return css`
        --_padding: var(
                ${namespaceWithVariant}-paddingY,
                var(${namespace}-paddingY, var(--spacings-tiny, 6px))
            )
            var(
                ${namespaceWithVariant}-paddingX,
                var(${namespace}-paddingX, var(--spacings-small, 12px))
            );
        --_letterSpacing: var(
            ${namespaceWithVariant}-letterSpacing,
            var(${namespace}-letterSpacing, var(--letterSpacings-default, 0))
        );
        --_textTransform: var(
            ${namespaceWithVariant}-textTransform,
            var(${namespace}-textTransform, 'none')
        );
        --_borderRadius: var(
            ${namespaceWithVariant}-borderRadius,
            var(${namespace}-borderRadius, var(--radii-default, 0))
        );
        --_border: var(
                ${namespaceWithVariant}-borderWidth,
                var(${namespace}-borderWidth, var(--borders-default-width, 0))
            )
            var(
                ${namespaceWithVariant}-borderColor,
                var(
                    ${namespace}-borderColor,
                    var(--colors-${variant}, ${color})
                )
            )
            var(
                ${namespaceWithVariant}-borderStyle,
                var(
                    ${namespace}-borderStyle,
                    var(--borders-default-style, solid)
                )
            );
        --_color: var(
            ${namespaceWithVariant}-color,
            var(${namespace}-color, var(--colors-${color}, ${color}))
        );
        --_colorHover: var(
            ${namespaceWithVariant}-hover-color,
            var(${namespace}-hover-color, var(--colors-${color}, ${color}))
        );
        --_fontWeight: var(
            ${namespaceWithVariant}-fontWeight,
            var(${namespace}-fontWeight, var(--fontWeights-default, '400'))
        );
        --_fontSize: var(
            ${namespaceWithVariant}-fontSize,
            var(${namespace}-fontSize, var(--fontSizes-default, 16px))
        );
        --_backgroundColor: var(
            ${namespaceWithVariant}-backgroundColor,
            var(
                ${namespace}-backgroundColor,
                var(--colors-${variant}, ${color})
            )
        );
        --_backgroundColorHover: var(
            ${namespaceWithVariant}-hover-backgroundColor,
            var(
                ${namespace}-hover-backgroundColor,
                var(--colors-${variant}Hover, ${color})
            )
        );
        --_borderColorHover: var(
            ${namespaceWithVariant}-hover-borderColor,
            var(
                ${namespace}-hover-borderColor,
                var(--colors-${variant}Hover, ${color})
            )
        );
        --_transition: var(
            ${namespaceWithVariant}-transition,
            var(
                ${namespace}-transition,
                all var(--motion-default, 0.2s ease-in-out)
            )
        );
    `
}

export const Button = styled(
    ({ width: _width, height: _height, ...rest }: ButtonProps) => (
        <button {...rest} />
    )
)`
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
    text-transform: var(--_textTransform);
    vertical-align: center;
    font-weight: var(--_fontWeight);
    font-size: var(--_fontSize);
    width: ${({ width }) => (width ? width : undefined)};
    height: ${({ height }) => (height ? height : undefined)};

    &:hover {
        background-color: var(--_backgroundColorHover);
        border-color: var(--_borderColorHover);
        color: var(--_colorHover);
    }
`

export const Icon = styled.span`
    display: flex;
    align-self: center;
`
