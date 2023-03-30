export const rem = (px: number, defaultFontSize: number = 16): `${string}rem` =>
    `${px / defaultFontSize}rem`

export const getFlexDirection = (direction: string | undefined) =>
    direction === 'horizontal'
        ? 'row'
        : direction === 'vertical'
        ? 'column'
        : undefined

export const getDirectionSpacing = (direction?: string) =>
    direction === 'horizontal'
        ? 'margin-left'
        : direction === 'vertical'
        ? 'margin-top'
        : undefined
