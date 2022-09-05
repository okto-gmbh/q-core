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

export type Fonts = {
    [key: 'heading' | 'body' | string]: string | GoogleFont
}

export type Breakpoints = {
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

export type DesignTokens = {
    fonts: Fonts
    fontWeights: {
        [key: 'default' | 'bold' | Headings | string]: number
    }
    fontSizes: TokenFontSizes
    lineHeights: TokenLineHeights
    letterSpacings: {
        [key: 'default' | Headings | string]: number
    }
    colors: {
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
    breakpoints: Breakpoints
    responsiveTokens: {
        [breakpoint in keyof Breakpoints]?: ResponsiveTokens
    }
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

const generateSpacings = (spacings: Partial<TokenSpacings>) => {
    const stringSpacings = Object.fromEntries(
        Object.entries(spacings)
            .filter(([, value]) => typeof value === 'string')
            .map(([name, value]) => [name, `var(--spacings-${value})`])
    )
    const generalSpacings = spacings?.baseline
        ? {
              tiny: spacings.baseline,
              small: spacings.baseline * 2,
              medium: spacings.baseline * 3,
              default: spacings.baseline * 4,
              large: spacings.baseline * 8,
              huge: spacings.baseline * 16
          }
        : {}

    return {
        ...spacings,
        ...stringSpacings,
        ...generalSpacings
    }
}

const generateFontSizes = (fontSizes: Partial<TokenFontSizes>) => ({
    ...fontSizes,
    ...Object.fromEntries(
        Object.entries(fontSizes).map(([tokenName, value]) => [
            tokenName,
            Array.isArray(value) ? buildFontSizeClamp(value) : value
        ])
    )
})

const generateLineHeights = (
    fontSizes: Partial<TokenFontSizes>,
    lineHeights: Partial<TokenLineHeights>
) =>
    Object.fromEntries(
        (
            Object.entries(fontSizes).filter(([, value]) =>
                Array.isArray(value)
            ) as [string, number[]][]
        ).map(([tokenName, value]) => [
            tokenName,
            Array.isArray(value)
                ? buildLineHeightClamp(value)
                : `calc(${value} * ${lineHeights[tokenName]})`
        ])
    )

// TODO: Generate on build for memoization
const colorPercentage = [10, 20, 30, 40, 50, 60, 70, 80, 90]
export const generateDesignTokens = (projectTokens: Partial<DesignTokens>) => {
    const settings = merge(coreTokens, projectTokens)

    settings.colors = {
        ...settings.colors,
        ...Object.fromEntries([
            ...colorPercentage.map((percent) => [
                `primary-light-${percent}`,
                new Color(settings.colors.primary).lighten(percent / 100).hex()
            ]),
            ...colorPercentage.map((percent) => [
                `primary-dark-${percent}`,
                new Color(settings.colors.primary).darken(percent / 100).hex()
            ]),
            ...colorPercentage.map((percent) => [
                `gray-${percent}`,
                new Color(settings.colors.black).lighten(percent / 100).hex()
            ])
        ])
    }

    settings.spacings = generateSpacings(settings.spacings) as TokenSpacings

    settings.fonts = {
        ...settings.fonts,
        ...Object.fromEntries(
            Object.entries(settings.fonts).map(([tokenName, value]) => [
                tokenName,
                typeof value === 'string'
                    ? value
                    : `"${value.name}",${
                          value.fallback || SYSTEM_FONTS_FALLBACK
                      }`
            ])
        )
    }

    settings.fontSizes = generateFontSizes(settings.fontSizes) as TokenFontSizes
    settings.lineHeights = generateLineHeights(
        settings.fontSizes,
        settings.lineHeights
    )

    settings.responsiveTokens = Object.fromEntries(
        Object.entries(settings.responsiveTokens).map(
            ([breakpoint, tokens]) => [
                breakpoint,
                {
                    ...Object.fromEntries(
                        Object.entries(tokens).map(([namespace, value]) => [
                            namespace,
                            namespace === 'spacings'
                                ? generateSpacings(value as TokenSpacings)
                                : namespace === 'fontSizes'
                                ? generateFontSizes(value as TokenFontSizes)
                                : value
                        ])
                    ),
                    lineHeights: {
                        ...(settings.responsiveTokens[breakpoint].lineHeights ||
                            {}),
                        ...generateLineHeights(
                            settings.responsiveTokens[breakpoint].fontSizes ||
                                {},
                            settings.responsiveTokens[breakpoint].lineHeights ||
                                {}
                        )
                    }
                }
            ]
        )
    )

    const fontWeights = Array.from(new Set(Object.values(settings.fontWeights)))
    const googleFonts = Array.from(
        new Set(
            (
                Object.values(projectTokens?.fonts || {}).filter(
                    (font) => typeof font !== 'string'
                ) as GoogleFont[]
            ).map(({ name }) => `${name}:wght@${fontWeights.join(';')}`)
        )
    )

    return {
        ...settings,
        googleFonts
    }
}
