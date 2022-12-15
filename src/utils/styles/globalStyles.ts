import { css, SerializedStyles } from '@emotion/react'

import { from, until } from '../breakpoints'

import {
    RawDesignTokens,
    ResponsiveTokens,
    TokenComponents,
    Variant,
    Variants
} from './designTokens'

const renderTokens = (
    tokens: RawDesignTokens | ResponsiveTokens = {}
): string =>
    Object.entries(tokens)
        .filter(
            ([namespace]) =>
                !['breakpoints', 'responsiveTokens', 'components'].includes(
                    namespace
                )
        )
        .map(([namespace, token]) =>
            Object.entries(token).map(
                ([name, value]) => `--${namespace}-${name}: ${value};`
            )
        )
        .flat()
        .join('\n')

const IDENTIFIER_BASE = '$base'
const IDENTIFIER_STATES = '$states'

const generateVariants = (
    componentName: string,
    variantName: string,
    variants: Variants | Variant
): string | string[] =>
    Object.entries(variants).flatMap(([propName, valueOrStates]) =>
        propName === IDENTIFIER_STATES
            ? Object.entries(valueOrStates).flatMap(([stateName, props]) =>
                  generateVariants(
                      `${componentName}${
                          variantName !== IDENTIFIER_BASE
                              ? `-${variantName}`
                              : ''
                      }`,
                      stateName,
                      props as Variant
                  )
              )
            : `--${componentName}${
                  variantName !== IDENTIFIER_BASE ? `-${variantName}` : ''
              }-${propName}: ${valueOrStates};`
    )

const renderComponentTokens = (tokens: TokenComponents = {}): string =>
    Object.entries(tokens)
        .flatMap(([componentName, componentTokens]) =>
            Object.entries(componentTokens).flatMap(([variantName, variants]) =>
                generateVariants(componentName, variantName, variants)
            )
        )
        .join('\n')

export const generateGlobalStyles = ({
    designTokens,
    customVariables,
    customReset
}: {
    customReset: SerializedStyles
    customVariables: SerializedStyles
    designTokens: RawDesignTokens
}) => css`
    :root {
        --_scrollbar-thumb-background: var(
            --scrollbar-thumb-background,
            var(--colors-primary, black)
        );
        --_scrollbar-thumb-hover-background: var(
            --scrollbar-thumb-hover-background,
            var(--colors-primaryHover, black)
        );
        --_scrollbar-track-background: var(
            --scrollbar-track-background,
            var(--colors-gray-90, grey)
        );
        --_selection-backgroundColor: var(
            --selection-backgroundColor,
            var(--colors-primary, black)
        );
        --_selection-color: var(--selection-color, var(--colors-white, white));
        --_placeholder-color: var(
            --placeholder-color,
            var(--colors-gray-60, grey)
        );
        --_link-color: var(--link-color, var(--colors-primary, black));
        --_link-textDecoration: var(--link-textDecoration, none);
        --_link-outline: var(--link-outline, none);
        --_link-transition: var(
            --link-transition,
            color var(--motion-default, 0.2s ease-in-out)
        );
        --_link-colorHover: var(
            --link-hover-color,
            var(--colors-primaryHover, black)
        );

        ${renderTokens(designTokens)}

        ${renderComponentTokens(designTokens.components)}

        ${customVariables}
    }

    ${Object.entries(designTokens.responsiveTokens || {})
        .map(
            ([breakpoint, responsiveTokens]) => `
                @media ${from[breakpoint]} {
                    :root {
                        ${renderTokens(responsiveTokens)}

                        ${renderComponentTokens(responsiveTokens.components)}

                    }
                }
            `
        )
        .join('\n')}

    // FIXME: Can we improve this to be less generic?
    * {
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }

    h1,
    h2,
    h3,
    h4,
    p,
    figure,
    blockquote,
    dl,
    dd {
        margin: 0;
    }

    fieldset {
        min-width: 0;
        padding: 0;
        border: 0;
        margin: 0;
    }

    a {
        color: var(--_link-color);
        outline: var(--_link-outline);
        text-decoration: var(--_link-textDecoration);
        transition: var(--_link-transition);

        :hover,
        :focus,
        :active {
            color: var(--_link-colorHover);
        }
    }

    ::selection {
        background-color: var(--_selection-backgroundColor);
        color: var(--_selection-color);
    }

    ::placeholder {
        color: var(--_placeholder-color);
    }

    ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
    }

    ::-webkit-scrollbar-thumb {
        background: var(--_scrollbar-thumb-background);
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--_scrollbar-thumb-hover-background);
    }

    ::-webkit-scrollbar-track {
        background: var(--_scrollbar-track-background);
    }

    :disabled {
        cursor: var(--cursors-disabled);
        opacity: var(--opacity-disabled);
    }

    html {
        accent-color: var(--colors-primary);
        color: var(--colors-black);
        scrollbar-color: var(--_scrollbar-thumb-background)
            var(--_scrollbar-track-background);
    }

    body {
        font-family: var(--fonts-body);
        font-size: var(--fontSizes-default);
        font-weight: var(--fontWeights-default);
        letter-spacing: var(--letterSpacings-default);
        line-height: var(--spacings-default);
        -ms-overflow-style: scrollbar;
        overflow-y: scroll;

        @media ${until.desktopS} {
            &.noscroll {
                position: fixed;
                overflow: hidden;
                width: 100%;
            }
        }
    }

    html,
    body,
    // eslint-disable-line selector-id-pattern
    #__next {
        height: 100%;
    }

    ol,
    ul,
    li {
        padding: 0;
        margin: 0;
        list-style: none;
    }

    ${customReset}
`
