export const DEFAULT_TIMEZONE = 'Europe/Zurich'
export const DEFAULT_LOCALE = 'de-CH'

export const format = (
    date: Date | string | null | undefined,
    { locale, ...options }: Intl.DateTimeFormatOptions & { locale: Intl.LocalesArgument }
): string => {
    if (!date) return ''
    if (typeof date === 'string') {
        date = new Date(date)
    }

    const config: Intl.DateTimeFormatOptions = {
        timeZone: options.timeZone || DEFAULT_TIMEZONE,
        ...options,
    }

    return date.toLocaleString(locale || DEFAULT_LOCALE, config)
}

export const formatDate = (
    date: Date | string | null | undefined,
    locale = DEFAULT_LOCALE,
    timeZone = DEFAULT_TIMEZONE
): string =>
    format(date, {
        day: '2-digit',
        locale,
        month: '2-digit',
        timeZone,
        year: 'numeric',
    })

export const formatDayAndMonth = (
    date: Date | string,
    locale = DEFAULT_LOCALE,
    timeZone = DEFAULT_TIMEZONE
): string =>
    format(date, {
        day: '2-digit',
        locale,
        month: '2-digit',
        timeZone,
    })

export const isValidDate = (date: any): date is Date =>
    Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date)

export const getTimestamp = (date?: Date | number | string) => {
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
        timeZone,
    })

const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity]
const units: Intl.RelativeTimeFormatUnit[] = [
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
    'year',
]

export function getRelativeTime(date: Date | number, lang = 'de'): string {
    const timeMs = typeof date === 'number' ? date : date.getTime()
    const deltaSeconds = Math.round((timeMs - Date.now()) / 1000)
    const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds))
    const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1

    const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })
    return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex])
}

/**
 *  Parses a date string in the format "DD.MM.YYYY" and returns a Date object.
 * @param dateString String in the format "DD.MM.YYYY"
 * @returns Date object or undefined if the string is not in the correct format
 */
export function parseDateString(dateString: string): Date | undefined {
    const match = dateString.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)

    if (match) {
        const day = parseInt(match[1], 10)
        const month = parseInt(match[2], 10) - 1 // Month is 0-based in JavaScript (0 = January, 11 = December)
        const year = parseInt(match[3], 10)

        const parsedDate = new Date(year, month, day)

        if (
            parsedDate.getDate() === day &&
            parsedDate.getMonth() === month &&
            parsedDate.getFullYear() === year
        ) {
            return parsedDate
        }
    }
}
