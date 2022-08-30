const SIZES = {
    mobile: '320px',
    mobileL: '480px',
    tabletS: '610px',
    tablet: '740px',
    desktop: '980px',
    wide: '1300px',
    megaWide: '1700px',
    ultraWide: '2000px'
}

const buildMediaQueries = (direction: 'min' | 'max') =>
    Object.entries(SIZES).reduce((acc, [key, size]) => {
        acc[key] = `(${direction}-width: ${size})`
        return acc
    }, {} as any)

export const from = buildMediaQueries('min')

export const until = buildMediaQueries('max')
