import Color from 'color'
import merge from 'lodash.merge'
import { rootCertificates } from 'tls'

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
    baseline: number | string
    tiny: number | string
    small: number | string
    medium: number | string
    default: number | string
    large: number | string
    huge: number | string
    [key: 'gap' | 'wrapper' | string]: Spacings | number | string
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

type TokenSizes = {
    [key: 'wrapper' | string]: number | string
}

export type DesignTokens = {
    fonts: TokenFonts
    fontWeights: TokenFontWeights
    fontSizes: TokenFontSizes
    lineHeights: TokenLineHeights
    letterSpacings: TokenLetterSpacings
    colors: TokenColors
    components: { [key: string]: { [key: string]: { [key: string]: string } } }
    backgrounds: {
        [key: 'default' | 'modal' | string]: string
    }
    sizes: TokenSizes
    spacings: TokenSpacings
    radii: {
        [key: 'default' | string]: number | string
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
    responsiveTokens?: TokenResponsiveTokens
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
        h1: -1,
        h2: -1,
        h3: -1,
        h4: 0,
        h5: 0
    },
    colors: {
        primary: '#6a94a0',
        primaryHover: 'var(--colors-primary-dark-20)',
        secondary: '#6a94a0',
        secondaryHover: 'var(--colors-secondary-dark-20)',
        danger: '#f04141',
        success: '#10dc60',
        info: '#10dc60',
        white: '#ffffff',
        black: '#2b2b2b'
    },
    components: {
        button: {
            borderRadius: 'var(--radii-default)',
            letterSpacing: 'var(--letterSpacings-default)',
            primary: {
                color: 'var(--colors-white)',
                backgroundColor: 'var(--colors-primary)',
                backgroundColorHover: 'var(--colors-primaryHover)',
                borderColor: 'var(--colors-primary)',
                borderColorHover: 'var(--colors-primaryHover)'
            },
            secondary: {
                color: 'var(--colors-black)',
                backgroundColor: 'var(--colors-secondary)',
                backgroundColorHover: 'var(--colors-secondaryHover)',
                borderColor: 'var(--colors-secondary)',
                borderColorHover: 'var(--colors-secondaryHover)'
            }
        },
        link: {
            color: 'var(--colors-primary)',
            colorHover: 'var(--colors-primaryHover)'
        },
        scrollbar: {
            thumb: {
                background: 'var(--colors-primary)',
                backgroundHover: 'var(--colors-primaryHover)'
            },
            track: {
                background: 'var(--colors-gray-90)'
            }
        },
        selection: {
            backgroundColor: 'var(--colors-primary)'
        },
        placeholder: {
            color: 'var(--colors-gray-60)'
        }
    },
    backgrounds: {
        default: '#ffffff',
        modal: 'rgba(0, 0, 0, 0.3)'
    },
    sizes: {
        wrapper: 1800
    },
    spacings: {
        baseline: 6,
        gap: 'default',
        wrapper: 'default',
        tiny: 1,
        small: 2,
        medium: 3,
        default: 4,
        large: 8,
        huge: 16
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
        default: '0px 1px 5px rgba(0, 0, 0, 0.16)',
        mui: 'var(--shadows-default)'
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
    }
}

const buildFontSizeClamp = ([min, max, value]: number[]) =>
    `clamp(${min}rem, ${value}vw, ${max}rem)`

const buildLineHeightClamp = ([min, max, value, faktor = 1.1]: number[]) =>
    `clamp(calc(${min}rem * ${faktor}), calc(${value}vw * ${faktor}), calc(${max}rem) * ${faktor})`

const spacingDefaultTokens = [
    'tiny',
    'small',
    'medium',
    'default',
    'large',
    'huge'
]

const generateSpacings = (
    originalSpacings: TokenSpacings,
    spacings: Partial<TokenSpacings> = {}
) => {
    const stringSpacings = Object.fromEntries(
        Object.entries(spacings)
            .filter(([, value]) => typeof value === 'string')
            .map(([name, value]) => [name, `var(--spacings-${value})`])
    )

    const definedTokens = Object.keys(spacings)
    let defaultSpacings = {}
    if (
        ['baseline', ...spacingDefaultTokens].some((tokenName) =>
            definedTokens.includes(tokenName)
        )
    ) {
        const baseline: number = (spacings.baseline ??
            originalSpacings.baseline) as number

        defaultSpacings = {
            baseline: spacings.baseline + 'px',
            ...Object.fromEntries(
                spacingDefaultTokens.map((tokenName) => [
                    tokenName,
                    `${
                        baseline *
                        ((spacings[tokenName] ??
                            originalSpacings[tokenName]) as number)
                    }px`
                ])
            )
        }
    }

    return {
        ...spacings,
        ...stringSpacings,
        ...defaultSpacings
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

const defaultLineHeights = ['tiny', 'small', 'default', 'medium', 'large']

const generateRegularLineHeights = (
    fontSizes: Partial<TokenFontSizes> = {},
    lineHeights: Partial<TokenLineHeights> = {}
) =>
    Object.fromEntries(
        Object.entries(fontSizes)
            .filter(([tokenName]) => defaultLineHeights.includes(tokenName))
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

const colorPercentage = [
    10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95
]
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
            `secondary-light-${percent}`,
            new Color(colors.secondary).lighten(percent / 100).hex()
        ]),
        ...colorPercentage.map((percent) => [
            `secondary-dark-${percent}`,
            new Color(colors.secondary).darken(percent / 100).hex()
        ]),
        ...colorPercentage.map((percent) => [
            `gray-${percent}`,
            new Color(colors.black).lightness(percent).hex()
        ])
    ])
})

const generateResponsiveTokens = (
    originalSpacings: TokenSpacings,
    originalLineHeights: TokenLineHeights,
    originalFontSizes: TokenFontSizes,
    responsiveTokens: TokenResponsiveTokens
) =>
    Object.fromEntries(
        Object.entries(responsiveTokens).map(([breakpoint, tokens]) => {
            const clampLineHeights = generateClampLineHeights(
                merge(originalFontSizes, tokens.fontSizes)
            )
            return [
                breakpoint,
                {
                    ...tokens,
                    spacings: generateSpacings(
                        originalSpacings,
                        tokens.spacings
                    ),
                    fontSizes: generateFontSizes(tokens.fontSizes),
                    lineHeights: {
                        ...clampLineHeights,
                        ...generateRegularLineHeights(
                            generateFontSizes(
                                merge(originalFontSizes, tokens.fontSizes)
                            ),
                            merge(originalLineHeights, tokens.lineHeights)
                        )
                    },
                    letterSpacings: generatePixelBasedValues(
                        tokens.letterSpacings
                    ),
                    sizes: generatePixelBasedValues(tokens.sizes),
                    radii: generatePixelBasedValues(tokens.radii)
                }
            ]
        })
    )

const generatePixelBasedValues = (tokens: Partial<DesignTokens> = {}) =>
    Object.fromEntries(
        Object.entries(tokens).map(([tokenName, value]) => [
            tokenName,
            value + 'px'
        ])
    )

// TODO: Generate on build for memoization
export const generateDesignTokens = (projectTokens: Partial<DesignTokens>) => {
    const settings = merge(coreTokens, projectTokens)
    const clampLineHeights = generateClampLineHeights(settings.fontSizes)

    const originalSpacings = settings.spacings
    const originalFontSizes = settings.fontSizes
    const originalLineHeights = settings.lineHeights
    settings.colors = generateColors(settings.colors)
    settings.spacings = generateSpacings(
        settings.spacings,
        settings.spacings
    ) as TokenSpacings
    settings.fonts = generateFonts(settings.fonts)
    settings.fontSizes = generateFontSizes(settings.fontSizes) as TokenFontSizes
    settings.letterSpacings = generatePixelBasedValues(settings.letterSpacings)
    settings.sizes = generatePixelBasedValues(settings.sizes)
    settings.radii = generatePixelBasedValues(settings.radii)
    settings.lineHeights = {
        ...clampLineHeights,
        ...generateRegularLineHeights(settings.fontSizes, settings.lineHeights)
    }
    settings.responsiveTokens = generateResponsiveTokens(
        originalSpacings,
        originalLineHeights,
        originalFontSizes,
        settings.responsiveTokens || {}
    )

    return settings
}
