import { TokenBreakpoints } from './styles/designTokens'

export const SIZES: TokenBreakpoints = {
    mobilePortrait: '320px',
    mobileLandscape: '480px',
    tabletPortrait: '610px',
    tabletLandscape: '740px',
    desktopS: '980px',
    desktopM: '1300px',
    desktopL: '1600px',
    desktopXL: '2000px'
}

const buildMediaQueries = (direction: 'min' | 'max') =>
    Object.entries(SIZES).reduce((acc, [key, size]) => {
        acc[key] = `(${direction}-width: ${size})`
        return acc
    }, {} as any)

export const from = buildMediaQueries('min')

export const until = buildMediaQueries('max')

export const between = (from: string, until: string) =>
    `(${from} < width < ${until})`
