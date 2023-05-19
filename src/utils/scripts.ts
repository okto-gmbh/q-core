import { EOL } from 'node:os'
import { createInterface } from 'node:readline/promises'

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
})

export type Parameters = {
    [name: string]: string | number | boolean | undefined
}

export type ResolvedParameters<ProvidedParameters extends Parameters> = {
    [Key in keyof ProvidedParameters]: ProvidedParameters[Key] extends undefined
        ? string | undefined
        : string
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export async function createScript<ProvidedParameters extends Parameters>(
    confirmationQuestion: string | undefined,
    parameters: ProvidedParameters
): Promise<ResolvedParameters<ProvidedParameters>> {
    const resolvedParameters = {} as ResolvedParameters<ProvidedParameters>

    for await (const [name, defaultValue] of Object.entries(parameters)) {
        const answer = await rl.question(`${name}: (${defaultValue}) `)
        //@ts-expect-error
        resolvedParameters[name] = answer || defaultValue
    }

    const parameterVariables = Object.entries(resolvedParameters).reduce(
        (acc, [name, value]) => {
            acc += `${EOL}${name}: ${value}`
            return acc
        },
        ''
    )

    const confirm = async () =>
        rl.question(
            `${EOL}` +
                `${EOL}About to run the script useing the following variables:` +
                `${EOL}` +
                parameterVariables +
                `${EOL}` +
                `${EOL}${
                    confirmationQuestion ?? 'Are you sure to run the script?'
                } (y/n) `
        )

    let answer = await confirm()

    while (answer !== 'y' && answer !== 'n') {
        answer = await confirm()
    }

    if (answer === 'n') {
        rl.close()
        console.log('Aborted.')
        process.exit(0)
    }

    rl.close()

    return resolvedParameters
}
