/* eslint-disable sonarjs/no-duplicate-string */
import Color from 'color'
import merge from 'lodash.merge'
import { Breakpoint, Color as ColorType, FontSize, Heading } from '../../types'

export type GoogleFont = {
    name: string
    fallback?: string
}

export type TokenBreakpoints = {
    [key in Breakpoint]: string
}

export type ResponsiveTokens = {
    [designToken in keyof Omit<
        RawDesignTokens,
        | 'responsiveTokens'
        | 'fonts'
        | 'cursors'
        | 'breakpoints'
        | 'colors'
        | 'backgrounds'
    >]?: RawDesignTokens[designToken]
}

export type TokenFonts = {
    [key: 'heading' | 'body' | string]: string | GoogleFont
}

export type TokenFontWeights = {
    [key: 'default' | 'bold' | Heading | string]: number
}

type TokenSpacings = {
    baseline: number
    tiny: number
    small: number
    medium: number
    default: number
    large: number
    huge: number
}

type TokenFontSizes = {
    [key: FontSize | Heading | string]: string | number | number[]
}

type TokenLineHeights = {
    [key: string]: number
}

type TokenColors = {
    [key: ColorType | string]: string
}

type TokenResponsiveTokens = {
    [breakpoint in keyof TokenBreakpoints]?: ResponsiveTokens
}

type TokenLetterSpacings = {
    [key: 'default' | Heading | string]: number
}

type TokenRadii = {
    [key: 'default' | string]: number
}

type Pixels<T extends { [key: string]: number }> = {
    [key in keyof T]: `${number}px`
}

type Stringify<T extends { [key: string]: number }> = {
    [key in keyof T]: string
}

export type TokenComponents = {
    [componentName: string]: {
        [key: string]:
            | string
            | {
                  [property: string]: string
              }
    }
}

export type DesignTokens = {
    fonts: TokenFonts
    fontWeights: TokenFontWeights
    fontSizes: TokenFontSizes
    lineHeights: TokenLineHeights | Stringify<TokenLineHeights>
    letterSpacings: TokenLetterSpacings | Pixels<TokenLetterSpacings>
    colors: TokenColors
    components: TokenComponents
    backgrounds: {
        [key: 'default' | string]: string
    }
    spacings: TokenSpacings | Pixels<TokenSpacings>
    radii: TokenRadii | Pixels<TokenRadii>
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

export type RawDesignTokens = DesignTokens & {
    spacings: TokenSpacings
    letterSpacings: TokenLetterSpacings
    radii: TokenRadii
    lineHeights: TokenLineHeights
}

export type GeneratedDesignTokens = DesignTokens & {
    spacings: Pixels<TokenSpacings>
    letterSpacings: Pixels<TokenLetterSpacings>
    radii: Pixels<TokenRadii>
    lineHeights: Stringify<TokenLineHeights>
}

export const SYSTEM_FONTS_FALLBACK =
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif"

const coreTokens: RawDesignTokens = {
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
    spacings: {
        baseline: 6,
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
        mobilePortrait: '320px',
        mobileLandscape: '480px',
        tabletPortrait: '610px',
        tabletLandscape: '740px',
        desktopS: '980px',
        desktopM: '1300px',
        desktopL: '1700px',
        desktopXL: '2000px'
    },
    backgrounds: {
        default: '#ffffff'
    },
    components: {
        button: {
            borderRadius: 'var(--borders-radius)',
            borderWidth: 'var(--borders-width)',
            borderColor: 'var(--borders-color)',
            letterSpacing: 'var(--letterSpacings-default)',
            borderStyle: 'var(--borders-style)',
            paddingTop: 'var(--spacings-tiny)',
            paddingRight: 'var(--spacings-small)',
            paddingBottom: 'var(--spacings-tiny)',
            paddingLeft: 'var(--spacings-small)',
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
        },
        wrapper: {
            maxWidth: '1600px',
            paddingLeft: 'var(--spacings-default)',
            paddingRight: 'var(--spacings-default)'
        },
        grid: {
            gridGap: 'var(--spacings-default)'
        }
    }
}

const buildFontSizeClamp = ([min, max, value]: number[]) =>
    `clamp(${min}rem, ${value}vw, ${max}rem)`

const buildLineHeightClamp = ([min, max, value, faktor = 1.1]: number[]) =>
    `clamp(calc(${min}rem * ${faktor}), calc(${value}vw * ${faktor}), calc(${max}rem) * ${faktor})`

const generateSpacings = (spacings: TokenSpacings): Pixels<TokenSpacings> => {
    return Object.fromEntries(
        Object.entries(spacings).map(([tokenName, tokenValue]) => [
            tokenName,
            `${
                (tokenName === 'baseline' ? 1 : spacings.baseline) * tokenValue
            }px`
        ])
    ) as Pixels<TokenSpacings>
}

const generateFontSizes = (fontSizes: TokenFontSizes = {}): TokenFontSizes =>
    Object.fromEntries(
        Object.entries(fontSizes).map(([tokenName, value]) => [
            tokenName,
            Array.isArray(value)
                ? buildFontSizeClamp(value)
                : `calc(var(--spacings-baseline) * ${value})`
        ])
    )

const generateClampLineHeights = (fontSizes: TokenFontSizes = {}) =>
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
    fontSizes: TokenFontSizes = {},
    lineHeights: TokenLineHeights = {}
) =>
    Object.fromEntries(
        Object.entries(fontSizes)
            .filter(([tokenName]) => defaultLineHeights.includes(tokenName))
            .map(([tokenName, value]) => [
                tokenName,
                `calc(${value} * ${lineHeights[tokenName]})`
            ])
    )

const generateFonts = (fonts: TokenFonts): TokenFonts => ({
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
const generateColors = (colors: TokenColors): TokenColors => ({
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
                        merge(originalSpacings, tokens.spacings)
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
                    radii: generatePixelBasedValues(tokens.radii),
                    components: generateComponentTokens(tokens.components)
                }
            ]
        })
    )

const generatePixelBasedValues = <T extends { [key: string]: number }>(
    tokens: T = <T>{}
): Pixels<T> =>
    Object.fromEntries(
        Object.entries(tokens).map(([tokenName, value]) => [
            tokenName,
            value + 'px'
        ])
    ) as Pixels<T>

const generateComponentTokens = (tokens: TokenComponents = {}) =>
    Object.fromEntries(
        Object.entries(tokens).map(([componentName, componentTokens]) => {
            const defaultTokens = Object.fromEntries(
                Object.entries(componentTokens).filter(
                    ([_, value]) => typeof value === 'string'
                )
            ) as { [key: string]: string }

            const variants = Object.fromEntries(
                Object.entries(componentTokens).filter(
                    ([_, value]) => typeof value === 'object'
                )
            ) as {
                [key: string]: {
                    [key: string]: string
                }
            }

            return Object.keys(variants).length === 0
                ? [componentName, defaultTokens]
                : [
                      componentName,
                      Object.fromEntries(
                          Object.entries(variants).map(
                              ([variantName, variantTokens]) => [
                                  variantName,
                                  {
                                      ...defaultTokens,
                                      ...variantTokens
                                  }
                              ]
                          )
                      )
                  ]
        })
    )

// TODO: Generate on build for memoization
export const generateDesignTokens = (
    projectTokens: Partial<RawDesignTokens>
) => {
    const settings = merge(coreTokens, projectTokens)

    const generatedFontSizes = generateFontSizes(settings.fontSizes)
    const generatedLineHeights = {
        ...generateClampLineHeights(settings.fontSizes),
        ...generateRegularLineHeights(generatedFontSizes, settings.lineHeights)
    }

    const generatedDesignTokens: GeneratedDesignTokens = {
        ...settings,
        colors: generateColors(settings.colors),
        spacings: generateSpacings(settings.spacings),
        fonts: generateFonts(settings.fonts),
        fontSizes: generatedFontSizes,
        letterSpacings: generatePixelBasedValues(settings.letterSpacings),
        radii: generatePixelBasedValues(settings.radii),
        lineHeights: generatedLineHeights,
        responsiveTokens: generateResponsiveTokens(
            settings.spacings,
            settings.lineHeights,
            settings.fontSizes,
            settings.responsiveTokens || {}
        ),
        components: generateComponentTokens(settings.components)
    }

    return generatedDesignTokens
}
