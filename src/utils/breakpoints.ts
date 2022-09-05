import { Breakpoints } from './styles/designTokens'

const SIZES: Breakpoints = {
    mobilePortrait: '320px',
    mobileLandscape: '480px',
    tabletPortrait: '610px',
    tabletLandscape: '740px',
    desktopS: '980px',
    desktopM: '1300px',
    desktopL: '1700px',
    desktopXL: '2000px'
}

const buildMediaQueries = (direction: 'min' | 'max') =>
    Object.entries(SIZES).reduce((acc, [key, size]) => {
        acc[key] = `(${direction}-width: ${size})`
        return acc
    }, {} as any)

export const from = buildMediaQueries('min')

export const until = buildMediaQueries('max')
