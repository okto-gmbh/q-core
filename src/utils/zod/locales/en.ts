import { ZodIssueCode, ZodParsedType } from 'zod'

import { assertNever, joinValues, jsonStringifyReplacer } from '../helpers'

import type { ZodErrorMap } from 'zod'

const errorMap: ZodErrorMap = (issue, { defaultError }) => {
    let message = ''
    switch (issue.code) {
        case ZodIssueCode.invalid_type:
            if (issue.received === ZodParsedType.undefined) {
                message = 'Required field'
            } else {
                message = `Expected ${issue.expected}, received ${issue.received}`
            }
            break
        case ZodIssueCode.invalid_literal:
            message = `Invalid value, expected ${JSON.stringify(
                issue.expected,
                jsonStringifyReplacer
            )}`
            break
        case ZodIssueCode.unrecognized_keys:
            message = `Unrecognized object key(s): ${joinValues(issue.keys, ', ')}`
            break
        case ZodIssueCode.invalid_union:
            message = 'Invalid input'
            break
        case ZodIssueCode.invalid_union_discriminator:
            message = `Invalid value, expected ${joinValues(issue.options)}`
            break
        case ZodIssueCode.invalid_enum_value:
            message = `Invalid value, expected ${joinValues(
                issue.options
            )}, received '${issue.received}'`
            break
        case ZodIssueCode.invalid_arguments:
            message = 'Invalid function arguments'
            break
        case ZodIssueCode.invalid_return_type:
            message = 'Invalid return type'
            break
        case ZodIssueCode.invalid_date:
            message = 'Invalid date'
            break
        case ZodIssueCode.invalid_string:
            if (typeof issue.validation === 'object') {
                if ('startsWith' in issue.validation) {
                    message = `Invalid input: Must start with "${issue.validation.startsWith}"`
                } else if ('endsWith' in issue.validation) {
                    message = `Invalid input: Must end with "${issue.validation.endsWith}"`
                } else {
                    assertNever(issue.validation as never)
                }
            } else if (issue.validation !== 'regex') {
                message = `Invalid value: ${issue.validation}`
            } else {
                message = 'Invalid'
            }
            break
        case ZodIssueCode.too_small:
            if (issue.type === 'array')
                message = `Array must contain ${
                    issue.inclusive ? 'at least' : 'more than'
                } ${issue.minimum} element(s)`
            else if (issue.type === 'string')
                message = `String must contain ${
                    issue.inclusive ? 'at least' : 'more than'
                } ${issue.minimum} character(s)`
            else if (issue.type === 'number')
                message = `Number must be greater than${
                    issue.inclusive ? ' or equal to ' : ' '
                }${issue.minimum}`
            else if (issue.type === 'date')
                message = `Date must be later than${
                    issue.inclusive ? ' or equal to ' : ' '
                }${new Date(Number(issue.minimum))}`
            else message = 'Invalid input'
            break
        case ZodIssueCode.too_big:
            if (issue.type === 'array')
                message = `Array must ${
                    issue.inclusive ? 'contain at most' : 'contain fewer than'
                } ${issue.maximum} element(s)`
            else if (issue.type === 'string')
                message = `String must ${
                    issue.inclusive ? 'contain at most' : 'contain fewer than'
                } ${issue.maximum} character(s)`
            else if (issue.type === 'number')
                message = `Number must be less than${
                    issue.inclusive ? ' or equal to ' : ' '
                }${issue.maximum}`
            else if (issue.type === 'date')
                message = `Date must be earlier than${
                    issue.inclusive ? ' or equal to ' : ' '
                }${new Date(Number(issue.maximum))}`
            else message = 'Invalid input'
            break
        case ZodIssueCode.custom:
            message = 'Invalid input'
            break
        case ZodIssueCode.invalid_intersection_types:
            message = 'Types could not be merged'
            break
        case ZodIssueCode.not_multiple_of:
            message = `Number must be a multiple of ${issue.multipleOf}`
            break
        default:
            message = defaultError
            assertNever(issue as never)
    }
    return { message }
}

export default errorMap
