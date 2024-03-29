export const DEFAULT_TIMEZONE = 'Europe/Zurich'
export const DEFAULT_LOCALE = 'de-CH'

export const format = (
    date: string | Date,
    {
        locale,
        ...options
    }: Intl.DateTimeFormatOptions & { locale: Intl.LocalesArgument }
): string => {
    if (!date) return ''
    if (typeof date === 'string') {
        date = new Date(date)
    }

    const config: Intl.DateTimeFormatOptions = {
        timeZone: options.timeZone || DEFAULT_TIMEZONE,
        ...options
    }

    return date.toLocaleString(locale || DEFAULT_LOCALE, config)
}

export const formatDate = (
    date: string | Date,
    locale = DEFAULT_LOCALE,
    timeZone = DEFAULT_TIMEZONE
): string =>
    format(date, {
        day: '2-digit',
        locale,
        month: '2-digit',
        timeZone,
        year: 'numeric'
    })

export const formatDayAndMonth = (
    date: string | Date,
    locale = DEFAULT_LOCALE,
    timeZone = DEFAULT_TIMEZONE
): string =>
    format(date, {
        day: '2-digit',
        locale,
        month: '2-digit',
        timeZone
    })

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const isValidDate = (date: any): boolean =>
    Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date)

export const getTimestamp = (date?: Date | string | number) => {
    if (!date) return

    date = new Date(date)

    return dateToTimestamp(date)
}

export const dateToTimestamp = (date: Date): number | undefined => {
    if (!date) return

    return parseInt(
        date.getFullYear() +
            (date.getMonth() + 1).toString().padStart(2, '0') +
            date.getDate().toString().padStart(2, '0'),
        10
    )
}

export const timestampToDate = (timestamp: number): Date | null => {
    if (!timestamp) return null

    const timestampStr = timestamp.toString()

    return new Date(
        `${timestampStr.slice(0, 4)}-${timestampStr
            .slice(4, 6)
            .toString()
            .padStart(2, '0')}-${timestampStr
            .slice(6, 8)
            .toString()
            .padStart(2, '0')}T00:00:00.000Z`
    )
}

export const getExportDate = (timeZone: string = 'Europe/Zurich'): string =>
    new Date().toLocaleDateString('fr-CA', {
        timeZone
    })
