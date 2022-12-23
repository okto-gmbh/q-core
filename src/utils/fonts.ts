import { GoogleFont, TokenFonts, TokenFontWeights } from './styles/designTokens'

export const getGoogleFontsFromDesignTokens = ({
    fonts = {},
    fontWeights = {}
}: {
    fontWeights: TokenFontWeights
    fonts: TokenFonts
}) => {
    const weights = Array.from(new Set(Object.values(fontWeights)))
    return Array.from(
        new Set(
            (
                Object.values(fonts).filter(
                    (font) => typeof font !== 'string'
                ) as GoogleFont[]
            ).map(({ name }) => `${name}:wght@${weights.join(';')}`)
        )
    )
}
