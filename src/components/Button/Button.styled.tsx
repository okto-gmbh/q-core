import { css } from '@emotion/react'
import styled from '@emotion/styled'

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
        --_borderWidthHover: var(
            ${namespaceWithVariant}-hover-borderWidth,
            var(
                ${namespace}-hover-borderWidth,
                var(--borders-${variant}-widthHover, 0)
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
        --_boxShadow: var(
            ${namespaceWithVariant}-boxShadow,
            var(${namespace}-boxShadow, undefined)
        );
        --_boxShadowHover: var(
            ${namespaceWithVariant}-hover-boxShadow,
            var(${namespace}-hover-boxShadow, undefined)
        );
    `
}

export const Button = styled(
    ({ width: _width, height: _height, ...rest }: ButtonProps) => (
        <button {...rest} />
    )
)`
    ${composeButtonVariants}
    width: ${({ width }) => (width ? width : undefined)};
    height: ${({ height }) => (height ? height : undefined)};
    padding: var(--_padding);
    border: var(--_border);
    border-radius: var(--_borderRadius);
    appearance: none;
    background-color: var(--_backgroundColor);
    box-shadow: var(--_boxShadow);
    color: var(--_color);
    cursor: pointer;
    font-size: var(--_fontSize);
    font-weight: var(--_fontWeight);
    letter-spacing: var(--_letterSpacing);
    outline: none;
    text-transform: var(--_textTransform);
    transition: var(--_transition);
    vertical-align: center;

    &:hover {
        border-width: var(--_borderWidthHover);
        border-color: var(--_borderColorHover);
        background-color: var(--_backgroundColorHover);
        box-shadow: var(--_boxShadowHover);
        color: var(--_colorHover);
    }
`

export const Icon = styled.span`
    display: flex;
    align-self: center;
`
