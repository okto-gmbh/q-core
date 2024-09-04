import parsePhoneNumber from 'libphonenumber-js'

import type { CountryCode } from 'libphonenumber-js'

export const formatNumber = (number?: number, locale: Intl.LocalesArgument = 'de-CH'): string =>
    (number || 0).toLocaleString(locale, {
        style: 'decimal',
    })

export const formatPhone = (phone?: string, locale: CountryCode = 'CH') => {
    if (!phone) return ''

    // Do not format short numbers like 118
    if (phone.length < 10) return phone

    const phoneParser = parsePhoneNumber(phone, locale)

    if (!phoneParser) return phone

    return phoneParser.formatInternational()
}
