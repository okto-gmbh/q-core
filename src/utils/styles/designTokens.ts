import Color from 'color'
import merge from 'lodash.merge'

export type Spacings =
    | 'tiny'
    | 'small'
    | 'medium'
    | 'default'
    | 'large'
    | 'huge'

export type GoogleFont = {
    name: string
    fallback?: string
}

export type TokenBreakpoints = {
    mobilePortrait: number | string
    mobileLandscape: number | string
    tabletPortrait: number | string
    tabletLandscape: number | string
    desktopS: number | string
    desktopM: number | string
    desktopL: number | string
    desktopXL: number | string
}

export type ResponsiveTokens = {
    [designToken in keyof Omit<
        DesignTokens,
        | 'responsiveTokens'
        | 'fonts'
        | 'cursors'
        | 'breakpoints'
        | 'colors'
        | 'backgrounds'
    >]?: Partial<DesignTokens[designToken]>
}

export type Headings = 'h1' | 'h2' | 'h3' | 'h4' | 'h5'

export type TokenFonts = {
    [key: 'heading' | 'body' | string]: string | GoogleFont
}

export type TokenFontWeights = {
    [key: 'default' | 'bold' | Headings | string]: number
}

type TokenSpacings = {
    baseline: number
    [key: 'gap' | string]: Spacings | number
}

type TokenFontSizes = {
    [
        key:
            | 'tiny'
            | 'small'
            | 'default'
            | 'medium'
            | 'large'
            | Headings
            | string
    ]: string | number | number[]
}

type TokenLineHeights = {
    [key: string]: string | number
}

type TokenColors = {
    [
        key:
            | 'primary'
            | 'danger'
            | 'success'
            | 'info'
            | 'white'
            | 'black'
            | string
    ]: string
}

type TokenResponsiveTokens = {
    [breakpoint in keyof TokenBreakpoints]?: ResponsiveTokens
}

type TokenLetterSpacings = {
    [key: 'default' | Headings | string]: number | string
}

export type DesignTokens = {
    fonts: TokenFonts
    fontWeights: TokenFontWeights
    fontSizes: TokenFontSizes
    lineHeights: TokenLineHeights
    letterSpacings: TokenLetterSpacings
    colors: TokenColors
    backgrounds: {
        [key: 'default' | 'modal' | string]: string
    }
    sizes: {
        [key: 'wrapper' | string]: number
    }
    spacings: TokenSpacings
    radii: {
        [key: 'default' | string]: number
    }
    borders: {
        [key: 'default' | string]: string
    }
    opacity: {
        [key: 'disabled' | string]: number
    }
    cursors: {
        [key: 'disabled' | string]: string
    }
    shadows: {
        [key: 'default' | string]: string
    }
    motion: {
        [key: 'default' | string]: string
    }
    breakpoints: TokenBreakpoints
    responsiveTokens: TokenResponsiveTokens
}

export const SYSTEM_FONTS_FALLBACK =
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif"

const coreTokens: DesignTokens = {
    fonts: {
        heading: SYSTEM_FONTS_FALLBACK,
        body: SYSTEM_FONTS_FALLBACK
    },
    fontWeights: {
        default: 400,
        bold: 600,
        h1: 600,
        h2: 600,
        h3: 600,
        h4: 400,
        h5: 400
    },
    fontSizes: {
        tiny: 2,
        small: 2.5,
        default: 3,
        medium: 3.33333,
        large: 4,
        h1: [1.75, 3.5, 5.5, 1.125],
        h2: [1.5, 2.5, 4.5, 1.2],
        h3: [1.25, 2, 4, 1.3125],
        h4: [1.125, 1.625, 3.5, 1.384615],
        h5: [1.125, 1.625, 3.5, 1.384615]
    },
    lineHeights: {
        tiny: 1.7,
        small: 1.6,
        default: 1.5,
        medium: 1.4,
        large: 1.3
    },
    letterSpacings: {
        default: 0,
        h1: -0.3,
        h2: -0.3,
        h3: -1,
        h4: 0,
        h5: 0
    },
    colors: {
        primary: '#6a94a0',
        danger: '#f04141',
        success: '#10dc60',
        info: '#10dc60',
        white: '#ffffff',
        black: '#2b2b2b'
    },
    backgrounds: {
        default: '#ffffff',
        modal: 'rgba(0, 0, 0, 0.3)'
    },
    sizes: {
        wrapper: 1800
    },
    spacings: {
        baseline: 5.4,
        gap: 'default'
    },
    radii: {
        default: 0
    },
    borders: {
        default: '0px solid transparent'
    },
    opacity: {
        disabled: 0.8
    },
    cursors: {
        disabled: 'not-allowed'
    },
    shadows: {
        default: '0px 1px 5px rgba(0, 0, 0, 0.16)'
    },
    motion: {
        default: '0.2s ease-in-out'
    },
    breakpoints: {
        mobilePortrait: 320,
        mobileLandscape: 480,
        tabletPortrait: 610,
        tabletLandscape: 740,
        desktopS: 980,
        desktopM: 1300,
        desktopL: 1700,
        desktopXL: 2000
    },
    responsiveTokens: {
        tabletLandscape: {
            spacings: {
                baseline: 6
            }
        },
        desktopS: {
            spacings: {
                gap: 'large'
            },
            letterSpacings: {
                default: 0,
                h1: -1,
                h2: -1,
                h3: -1,
                h4: 0,
                h5: 0
            }
        }
    }
}

const buildFontSizeClamp = ([min, max, value]: number[]) =>
    `clamp(${min}rem, ${value}vw, ${max}rem)`

const buildLineHeightClamp = ([min, max, value, faktor = 1.1]: number[]) =>
    `clamp(calc(${min}rem * ${faktor}), calc(${value}vw * ${faktor}), calc(${max}rem) * ${faktor})`

const generateSpacings = (spacings: Partial<TokenSpacings> = {}) => {
    const stringSpacings = Object.fromEntries(
        Object.entries(spacings)
            .filter(([, value]) => typeof value === 'string')
            .map(([name, value]) => [name, `var(--spacings-${value})`])
    )
    const generalSpacings = spacings?.baseline
        ? {
              baseline: spacings.baseline + 'px',
              tiny: spacings.baseline + 'px',
              small: spacings.baseline * 2 + 'px',
              medium: spacings.baseline * 3 + 'px',
              default: spacings.baseline * 4 + 'px',
              large: spacings.baseline * 8 + 'px',
              huge: spacings.baseline * 16 + 'px'
          }
        : {}

    return {
        ...spacings,
        ...stringSpacings,
        ...generalSpacings
    }
}

const generateFontSizes = (fontSizes: Partial<TokenFontSizes> = {}) =>
    Object.fromEntries(
        Object.entries(fontSizes).map(([tokenName, value]) => [
            tokenName,
            Array.isArray(value)
                ? buildFontSizeClamp(value)
                : `calc(var(--spacings-baseline) * ${value})`
        ])
    )

const generateClampLineHeights = (fontSizes: Partial<TokenFontSizes> = {}) =>
    Object.fromEntries(
        Object.entries(fontSizes)
            .filter(([, value]) => Array.isArray(value))
            .map(([tokenName, value]) => [
                tokenName,
                buildLineHeightClamp(value as number[])
            ])
    )

const generateRegularLineHeights = (
    fontSizes: Partial<TokenFontSizes> = {},
    lineHeights: Partial<TokenLineHeights> = {}
) =>
    Object.fromEntries(
        Object.entries(fontSizes)
            .filter(([, value]) => typeof value === 'number')
            .map(([tokenName, value]) => [
                tokenName,
                `calc(${value} * ${lineHeights[tokenName]})`
            ])
    )

const generateFonts = (fonts: TokenFonts) => ({
    ...fonts,
    ...Object.fromEntries(
        Object.entries(fonts).map(([tokenName, value]) => [
            tokenName,
            typeof value === 'string'
                ? value
                : `'${value.name}',${value.fallback || SYSTEM_FONTS_FALLBACK}`
        ])
    )
})

const colorPercentage = [10, 20, 30, 40, 50, 60, 70, 80, 90]
const generateColors = (colors: TokenColors) => ({
    ...colors,
    ...Object.fromEntries([
        ...colorPercentage.map((percent) => [
            `primary-light-${percent}`,
            new Color(colors.primary).lighten(percent / 100).hex()
        ]),
        ...colorPercentage.map((percent) => [
            `primary-dark-${percent}`,
            new Color(colors.primary).darken(percent / 100).hex()
        ]),
        ...colorPercentage.map((percent) => [
            `gray-${percent}`,
            new Color(colors.black).lightness(percent).hex()
        ])
    ])
})

const generateResponsiveTokens = (responsiveTokens: TokenResponsiveTokens) =>
    Object.fromEntries(
        Object.entries(responsiveTokens).map(([breakpoint, tokens]) => {
            const clampLineHeights = generateClampLineHeights(tokens.fontSizes)
            return [
                breakpoint,
                {
                    ...tokens,
                    spacings: generateSpacings(tokens.spacings),
                    fontSizes: generateFontSizes(tokens.fontSizes),
                    lineHeights: {
                        ...clampLineHeights,
                        ...generateRegularLineHeights(
                            tokens.fontSizes,
                            tokens.lineHeights
                        )
                    },
                    letterSpacings: generateLetterSpacings(
                        tokens.letterSpacings
                    )
                }
            ]
        })
    )

const generateLetterSpacings = (
    letterSpacings: Partial<TokenLetterSpacings> = {}
) =>
    Object.fromEntries(
        Object.entries(letterSpacings).map(([tokenName, value]) => [
            tokenName,
            value + 'px'
        ])
    )

// TODO: Generate on build for memoization
export const generateDesignTokens = (projectTokens: Partial<DesignTokens>) => {
    const settings = merge(coreTokens, projectTokens)
    const clampLineHeights = generateClampLineHeights(settings.fontSizes)

    settings.colors = generateColors(settings.colors)
    settings.spacings = generateSpacings(settings.spacings) as TokenSpacings
    settings.fonts = generateFonts(settings.fonts)
    settings.fontSizes = generateFontSizes(settings.fontSizes) as TokenFontSizes
    settings.letterSpacings = generateLetterSpacings(
        settings.letterSpacings
    ) as TokenLetterSpacings
    settings.lineHeights = {
        ...clampLineHeights,
        ...generateRegularLineHeights(settings.fontSizes, settings.lineHeights)
    }
    settings.responsiveTokens = generateResponsiveTokens(
        settings.responsiveTokens
    )

    return settings
}
