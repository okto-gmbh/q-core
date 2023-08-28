import { ZodIssueCode, ZodParsedType } from 'zod'

import { assertNever, joinValues, jsonStringifyReplacer } from '../helpers'

import type { ZodErrorMap } from 'zod'

// eslint-disable-next-line sonarjs/cognitive-complexity
const errorMap: ZodErrorMap = (issue, { defaultError }) => {
    let message = ''
    switch (issue.code) {
        case ZodIssueCode.invalid_type:
            if (issue.received === ZodParsedType.undefined) {
                message = 'Pflichtfeld'
            } else {
                message = `Erwartet ${issue.expected}, erhalten ${issue.received}`
            }
            break
        case ZodIssueCode.invalid_literal:
            message = `Ungültiger Wert, erwartet ${JSON.stringify(
                issue.expected,
                jsonStringifyReplacer
            )}`
            break
        case ZodIssueCode.unrecognized_keys:
            message = `Unerkannte Objekt-Key(s): ${joinValues(
                issue.keys,
                ', '
            )}`
            break
        case ZodIssueCode.invalid_union:
            message = 'Ungültige Eingabe'
            break
        case ZodIssueCode.invalid_union_discriminator:
            message = `Ungültiger Wert, erwartet ${joinValues(issue.options)}`
            break
        case ZodIssueCode.invalid_enum_value:
            message = `Ungültiger Wert, erwartet ${joinValues(
                issue.options
            )}, erhalten '${issue.received}'`
            break
        case ZodIssueCode.invalid_arguments:
            message = 'Ungültige Funktionsargumente'
            break
        case ZodIssueCode.invalid_return_type:
            message = 'Ungültiger Return-Typ'
            break
        case ZodIssueCode.invalid_date:
            message = 'Ungültiges Datum'
            break
        case ZodIssueCode.invalid_string:
            if (typeof issue.validation === 'object') {
                if ('startsWith' in issue.validation) {
                    message = `Ungültige Eingabe: Muss mit "${issue.validation.startsWith}" starten`
                } else if ('endsWith' in issue.validation) {
                    message = `Ungültige Eingabe: Muss mit "${issue.validation.endsWith}" enden`
                } else {
                    assertNever(issue.validation as never)
                }
            } else if (issue.validation !== 'regex') {
                message = `Ungültiger Wert: ${issue.validation}`
            } else {
                message = 'Ungültig'
            }
            break
        case ZodIssueCode.too_small:
            if (issue.type === 'array')
                message = `Array muss ${
                    issue.inclusive ? 'mindestens' : 'mehr als'
                } ${issue.minimum} Element(e) beinhalten`
            else if (issue.type === 'string')
                message = `String muss ${
                    issue.inclusive ? 'mindestens' : 'mehr als'
                } ${issue.minimum} Zeichen umfassen`
            else if (issue.type === 'number')
                message = `Nummer muss grösser ${
                    issue.inclusive ? 'oder gleich ' : ''
                }${issue.minimum} sein`
            else if (issue.type === 'date')
                message = `Datum muss grösser ${
                    issue.inclusive ? 'oder gleich ' : ''
                }${new Date(Number(issue.minimum))} sein`
            else message = 'Ungültige Eingabe'
            break
        case ZodIssueCode.too_big:
            if (issue.type === 'array')
                message = `Array ${
                    issue.inclusive ? 'darf maximal' : 'muss weniger als'
                } ${issue.maximum} Element(e) beinhalten`
            else if (issue.type === 'string')
                message = `String ${
                    issue.inclusive ? 'darf maximal' : 'muss weniger als'
                } ${issue.maximum} Zeichen umfassen`
            else if (issue.type === 'number')
                message = `Nummer muss kleiner ${
                    issue.inclusive ? 'oder gleich ' : ''
                }${issue.maximum} sein`
            else if (issue.type === 'date')
                message = `Datum muss kleiner ${
                    issue.inclusive ? 'oder gleich ' : ''
                }${new Date(Number(issue.maximum))} sein`
            else message = 'Ungültige Eingabe'
            break
        case ZodIssueCode.custom:
            message = 'Ungültige Eingabe'
            break
        case ZodIssueCode.invalid_intersection_types:
            message = 'Typen konnten nicht zusammengeführt werden'
            break
        case ZodIssueCode.not_multiple_of:
            message = `Nummer muss ein Mehrfaches von ${issue.multipleOf} sein`
            break
        default:
            message = defaultError
            assertNever(issue as never)
    }
    return { message }
}

export default errorMap
