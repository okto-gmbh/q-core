export const formatMoney = (
    amount?: number,
    {
        locale = 'de-CH',
        ...options
    }: Intl.NumberFormatOptions & { locale?: Intl.LocalesArgument } = {}
) => {
    return (amount || 0).toLocaleString(locale, {
        currency: 'CHF',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        ...options,
    })
}
