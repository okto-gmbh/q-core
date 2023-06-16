/* eslint-disable sonarjs/no-duplicate-string */
import Color from 'color'
import merge from 'lodash.merge'

import type {
    Breakpoint,
    Color as ColorType,
    FontSize,
    Heading
} from '../../types'

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
    default: number
    huge: number
    large: number
    medium: number
    small: number
    tiny: number
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

export type Property = {
    [property: string]: string
}

export type Variant = {
    [propertyOrStates: '$states' | string]: Property
}

export type Variants = { [variant: '$base' | string]: Variant }

export type TokenComponents = {
    [componentName: string]: Variants
}

type TokenMotion = {
    [key: 'default' | string]:
        | string
        | {
              duration: string
              function: string
          }
}

type TokenBorders = {
    [key: 'default' | string]:
        | string
        | {
              color: string
              style: string
              width: string
          }
}

export type DesignTokens = {
    backgrounds: {
        [key: 'default' | string]: string
    }
    borders: TokenBorders
    breakpoints: TokenBreakpoints
    colors: TokenColors
    cursors: {
        [key: 'disabled' | string]: string
    }
    fontSizes: TokenFontSizes
    fontWeights: TokenFontWeights
    fonts: TokenFonts
    letterSpacings: TokenLetterSpacings | Pixels<TokenLetterSpacings>
    lineHeights: TokenLineHeights | Stringify<TokenLineHeights>
    motion: TokenMotion
    opacity: {
        [key: 'disabled' | string]: number
    }
    radii: TokenRadii | Pixels<TokenRadii>
    shadows: {
        [key: 'default' | string]: string
    }
    spacings: TokenSpacings | Pixels<TokenSpacings>
    components?: TokenComponents
    responsiveTokens?: TokenResponsiveTokens
}

export type RawDesignTokens = DesignTokens & {
    letterSpacings: TokenLetterSpacings
    lineHeights: TokenLineHeights
    radii: TokenRadii
    spacings: TokenSpacings
}

export type GeneratedDesignTokens = DesignTokens & {
    letterSpacings: Pixels<TokenLetterSpacings>
    lineHeights: Stringify<TokenLineHeights>
    radii: Pixels<TokenRadii>
    spacings: Pixels<TokenSpacings>
}

export const SYSTEM_FONTS_FALLBACK =
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif"

const coreTokens: RawDesignTokens = {
    backgrounds: {
        default: '#ffffff'
    },
    borders: {
        default: {
            color: 'transparent',
            style: 'solid',
            width: '0px'
        }
    },
    breakpoints: {
        desktopL: '1600px',
        desktopM: '1300px',
        desktopS: '980px',
        desktopXL: '2000px',
        mobileLandscape: '480px',
        mobilePortrait: '320px',
        tabletLandscape: '740px',
        tabletPortrait: '610px'
    },
    colors: {
        black: '#2b2b2b',
        danger: '#f04141',
        info: '#10dc60',
        primary: '#6a94a0',
        primaryHover: 'var(--colors-primary-dark-20)',
        secondary: '#6a94a0',
        secondaryHover: 'var(--colors-secondary-dark-20)',
        success: '#10dc60',
        white: '#ffffff'
    },
    cursors: {
        disabled: 'not-allowed'
    },
    fontSizes: {
        default: 3,
        h1: [1.75, 3.5, 5.5, 1.125],
        h2: [1.5, 2.5, 4.5, 1.2],
        h3: [1.25, 2, 4, 1.3125],
        h4: [1.125, 1.625, 3.5, 1.384615],
        h5: [1.125, 1.625, 3.5, 1.384615],
        large: 4,
        medium: 3.33333,
        small: 2.5,
        tiny: 2
    },
    fontWeights: {
        bold: 600,
        default: 400,
        h1: 600,
        h2: 600,
        h3: 600,
        h4: 400,
        h5: 400
    },
    fonts: {
        body: SYSTEM_FONTS_FALLBACK,
        heading: SYSTEM_FONTS_FALLBACK
    },
    letterSpacings: {
        default: 0,
        h1: -1,
        h2: -1,
        h3: -1,
        h4: 0,
        h5: 0
    },
    lineHeights: {
        default: 1.5,
        large: 1.3,
        medium: 1.4,
        small: 1.6,
        tiny: 1.7
    },
    motion: {
        default: {
            duration: '.2s',
            function: 'ease-in-out'
        }
    },
    opacity: {
        disabled: 0.8
    },
    radii: {
        default: 0
    },
    shadows: {
        default: '0px 1px 5px rgba(0, 0, 0, 0.16)',
        mui: 'var(--shadows-default)'
    },
    spacings: {
        baseline: 6,
        default: 4,
        huge: 16,
        large: 8,
        medium: 3,
        small: 2,
        tiny: 1
    }
}

const buildFontSizeClamp = ([min, max, value]: number[]) =>
    `clamp(${min}rem, ${value}vw, ${max}rem)`

const buildLineHeightClamp = ([min, max, value, faktor = 1.1]: number[]) =>
    `clamp(calc(${min}rem * ${faktor}), calc(${value}vw * ${faktor}), calc(${max}rem) * ${faktor})`

const generateSpacings = (spacings: TokenSpacings): Pixels<TokenSpacings> =>
    Object.fromEntries(
        Object.entries(spacings).map(([tokenName, tokenValue]) => [
            tokenName,
            `${
                (tokenName === 'baseline' ? 1 : spacings.baseline) * tokenValue
            }px`
        ])
    ) as Pixels<TokenSpacings>

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
    lineHeights: TokenLineHeights = {},
    tokenNames?: string[]
) =>
    Object.fromEntries(
        Object.entries(fontSizes)
            .filter(([tokenName]) =>
                (tokenNames || defaultLineHeights).includes(tokenName)
            )
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

type ThemeMode = 'light' | 'dark'

const colorPercentage = [
    10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95
]

const generateColors = (colors: TokenColors, mode: ThemeMode): TokenColors => ({
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
            `gray-${mode === 'dark' ? 100 - percent : percent}`,
            new Color(mode === 'dark' ? colors.white : colors.black)
                .lightness(percent)
                .hex()
        ])
    ])
})

const generateStyleProperties = (namespace: string, props: any) =>
    Object.entries(props).map(([propName, value]) => [
        `${namespace}-${propName}`,
        value
    ])

const generateMotion = (motion: TokenMotion = {}): TokenMotion =>
    Object.fromEntries(
        Object.entries(motion).flatMap(([namespace, value]) =>
            typeof value === 'string'
                ? [[namespace, value]]
                : [
                      [namespace, `${value.duration} ${value.function}`],
                      ...generateStyleProperties(namespace, value)
                  ]
        )
    )

const generateBorders = (borders: TokenBorders = {}): TokenBorders =>
    Object.fromEntries(
        Object.entries(borders).flatMap(([namespace, border]) =>
            typeof border === 'string'
                ? [[namespace, border]]
                : [
                      [
                          namespace,
                          `${border.width} ${border.color} ${border.style}`
                      ],
                      ...generateStyleProperties(namespace, border)
                  ]
        )
    )

const generateResponsiveTokens = (
    originalSpacings: TokenSpacings,
    originalLineHeights: TokenLineHeights,
    originalFontSizes: TokenFontSizes,
    responsiveTokens: TokenResponsiveTokens
) =>
    Object.fromEntries(
        Object.entries(responsiveTokens).map(([breakpoint, tokens]) => [
            breakpoint,
            {
                ...tokens,
                borders: generateBorders(tokens.borders),
                fontSizes: generateFontSizes(tokens.fontSizes),
                letterSpacings: generatePixelBasedValues(tokens.letterSpacings),
                lineHeights: {
                    ...generateRegularLineHeights(
                        generateFontSizes(
                            merge({}, originalFontSizes, tokens.fontSizes)
                        ),
                        merge({}, originalLineHeights, tokens.lineHeights),
                        [
                            ...Object.keys(tokens.fontSizes ?? {}),
                            ...Object.keys(tokens.lineHeights ?? {})
                        ]
                    )
                },
                motion: generateMotion(tokens.motion),
                radii: generatePixelBasedValues(tokens.radii),
                spacings: tokens.spacings
                    ? generateSpacings(
                          merge({}, originalSpacings, tokens.spacings)
                      )
                    : {}
            }
        ])
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

// TODO: Generate on build for memoization
export const generateDesignTokens = (
    projectTokens: Partial<RawDesignTokens>,
    mode: ThemeMode = 'light'
) => {
    const settings = merge({}, coreTokens, projectTokens)

    const generatedFontSizes = generateFontSizes(settings.fontSizes)
    const generatedLineHeights = {
        ...generateClampLineHeights(settings.fontSizes),
        ...generateRegularLineHeights(generatedFontSizes, settings.lineHeights)
    }

    const generatedDesignTokens: GeneratedDesignTokens = {
        ...settings,
        borders: generateBorders(settings.borders),
        colors: generateColors(settings.colors, mode),
        fontSizes: generatedFontSizes,
        fonts: generateFonts(settings.fonts),
        letterSpacings: generatePixelBasedValues(settings.letterSpacings),
        lineHeights: generatedLineHeights,
        motion: generateMotion(settings.motion),
        radii: generatePixelBasedValues(settings.radii),
        responsiveTokens: generateResponsiveTokens(
            settings.spacings,
            settings.lineHeights,
            settings.fontSizes,
            settings.responsiveTokens || {}
        ),
        spacings: generateSpacings(settings.spacings)
    }

    return generatedDesignTokens
}
