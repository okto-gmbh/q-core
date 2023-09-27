export const formatNumber = (
    number?: number,
    locale: Intl.LocalesArgument = 'de-CH'
): string =>
    (number || 0).toLocaleString(locale, {
        style: 'decimal'
    })
