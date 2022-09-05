import { css, SerializedStyles } from '@emotion/react'
import { DesignTokens, ResponsiveTokens } from './designTokens'
import { from } from '../breakpoints'

const renderTokens = (tokens: DesignTokens | ResponsiveTokens): string =>
    Object.entries(tokens)
        .filter(
            ([namespace]) =>
                !['breakpoints', 'responsiveTokens', 'fontSizes'].includes(
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

export const generate = ({
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

        ${Object.entries(tokens.fontSizes)
            .filter(([, value]) => typeof value !== 'string')
            .map(
                ([name, value]) => css`
            --fontSizes-${name}: calc(var(--baseline) * ${value});
        `
            )
            .join('\n')}

        ${Object.entries(tokens.responsiveTokens).map(
            ([breakpoint, responsiveTokens]) => css`
                @media ${from[breakpoint]} {
                    ${renderTokens(responsiveTokens)}
                }
            `
        )}

        ${customVariables}
    }

    ${customReset}
`
