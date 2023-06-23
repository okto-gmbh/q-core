import type { TokenBreakpoints } from './styles/designTokens'

export const SIZES: TokenBreakpoints = {
    desktopL: '1600px',
    desktopM: '1300px',
    desktopS: '980px',
    desktopXL: '2000px',
    mobileLandscape: '480px',
    mobilePortrait: '320px',
    tabletLandscape: '740px',
    tabletPortrait: '610px'
}

const buildMediaQueries = (direction: 'min' | 'max') =>
    Object.entries(SIZES).reduce((acc, [key, size]) => {
        acc[key] = `(${direction}-width: ${size})`
        return acc
    }, {} as any)

export const from = buildMediaQueries('min')

export const until = buildMediaQueries('max')

export const between = (minSize: string, maxSize: string) =>
    `(min-width: ${minSize}) and (max-width: ${maxSize})`
