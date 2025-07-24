export const formatMoney = (
    amount?: number,
    locale: Intl.LocalesArgument = 'de-CH',
    currency = 'CHF',
    options?: Intl.NumberFormatOptions
): string =>
    (amount || 0).toLocaleString(locale, {
        currency,
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
        style: 'currency',
        ...options,
    })

export const formatCHF = (amount?: number, options?: Intl.NumberFormatOptions) => {
    return formatMoney(amount, 'de-CH', 'CHF', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        ...options,
    })
}
