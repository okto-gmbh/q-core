export const formatMoney = (
    amount?: number,
    locale: Intl.LocalesArgument = 'de-CH',
    currency = 'CHF'
): string =>
    (amount || 0).toLocaleString(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })
