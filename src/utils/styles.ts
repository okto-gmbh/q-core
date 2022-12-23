export const rem = (px: number, defaultFontSize: number = 16): `${string}rem` =>
    `${px / defaultFontSize}rem`
