import { css, SerializedStyles } from '@emotion/react'
import { DesignTokens, ResponsiveTokens } from './designTokens'
import { from } from '../breakpoints'

const renderTokens = (tokens: DesignTokens | ResponsiveTokens = {}): string =>
    Object.entries(tokens)
        .filter(
            ([namespace]) =>
                ![
                    'breakpoints',
                    'responsiveTokens',
                    'fontSizes',
                    'googleFonts'
                ].includes(namespace)
        )
        .map(([namespace, token]) =>
            Object.entries(token).map(
                ([name, value]) => `--${namespace}-${name}: ${value};`
            )
        )
        .flat()
        .join('\n')

export const generateGlobalStyles = ({
    tokens,
    customVariables,
    customReset
}: {
    tokens: DesignTokens
    customVariables: SerializedStyles
    customReset: SerializedStyles
}) => css`
    :root {
        ${renderTokens(tokens)}

        ${Object.entries(tokens.fontSizes || {})
            .filter(([, value]) => typeof value !== 'string')
            .map(
                ([name, value]) =>
                    `--fontSizes-${name}: calc(var(--baseline) * ${value});`
            )
            .join('\n')}

        ${Object.entries(tokens.responsiveTokens || {})
            .map(
                ([breakpoint, responsiveTokens]) => `
                    @media ${from[breakpoint]} {
                        ${renderTokens(responsiveTokens)}
                    }
                `
            )
            .join('\n')}

        ${customVariables}
    }

    ${customReset}
`
