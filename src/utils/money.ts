export const formatMoney = (
    amount?: number,
    locale: Intl.LocalesArgument = 'de-CH',
    currency = 'CHF'
): string =>
    (amount || 0).toLocaleString(locale, {
        currency,
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
        style: 'currency'
    })
