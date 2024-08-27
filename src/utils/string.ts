export const vars = (template: string, vars: { [key: string]: string }): string =>
    Object.entries(vars).reduce(
        (str, [key, value]) =>
            // TODO: Fix this by using split/join instead of replace
            // eslint-disable-next-line security/detect-non-literal-regexp
            str.replace(new RegExp(`\\{${escapeRegex(key)}\\}`, 'g'), value),
        template
    )

const escapeRegex = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
