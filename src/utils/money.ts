export const formatMoney = (
    amount: number = 0,
    {
        locale = 'de-CH',
        ...options
    }: Intl.NumberFormatOptions & { locale?: Intl.LocalesArgument } = {}
) => {
    return amount.toLocaleString(locale, {
        currency: 'CHF',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        ...options,
    })
}
