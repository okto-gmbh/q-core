export function assertNever(_x: never): never {
    throw new Error()
}

export function joinValues<T extends any[]>(
    array: T,
    separator = ' | '
): string {
    return array
        .map((val) => (typeof val === 'string' ? `'${val}'` : val))
        .join(separator)
}

export const jsonStringifyReplacer = (_: string, value: any): any => {
    if (typeof value === 'bigint') {
        return value.toString()
    }
    return value
}
