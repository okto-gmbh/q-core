'use client'

import { forwardRef } from 'react'
import { Controller } from 'react-hook-form'

import * as Styled from './TextInput.styled'

import type { TextFieldProps } from '@mui/material'
import type { Ref } from 'react'
import type { Control, ControllerRenderProps, FieldValues } from 'react-hook-form'

export type TextInputProps = TextFieldProps & {
    control?: Control<FieldValues>
    fieldName?: string
    grow?: 'auto'
    round?: boolean
}

const TextInput = (
    {
        control,
        defaultValue,
        fieldName,
        inputRef,
        onChange,
        round,
        type,
        value,
        ...props
    }: TextInputProps,
    ref: Ref<HTMLDivElement | null | undefined>
) => {
    const setRef = (r: HTMLInputElement) =>
        [ref, inputRef].forEach((ref) => {
            if (ref) {
                if (typeof ref === 'function') {
                    ref(r)
                } else {
                    ref.current = r
                }
            }
        })

    const handleChange = (event: any, field: ControllerRenderProps<FieldValues, string>) => {
        field.onChange?.(event)

        if (control && onChange) {
            ;(onChange as any)(field.name, event.target.value, {
                shouldDirty: true,
                shouldValidate: true,
            })
        }
    }

    props.inputProps = props.inputProps || {}
    if (type === 'number') {
        props.inputProps = {
            ...props.inputProps,
            inputMode: 'numeric',
            pattern: '[\\.0-9]*',
        }
    } else if (type === 'email') {
        props.inputProps = {
            ...props.inputProps,
            type: 'email',
        }
    } else if (type === 'tel') {
        props.inputProps = {
            ...props.inputProps,
            type: 'tel',
        }
    }

    const getValue = (field: ControllerRenderProps<FieldValues, string>): string => {
        if (control) {
            return field.value ?? defaultValue ?? ''
        }

        return field.value ?? defaultValue
    }

    const renderInput = (field: ControllerRenderProps<FieldValues, string>) => (
        <Styled.Input
            InputLabelProps={props.multiline ? { sx: Styled.multilineLabelProps } : undefined}
            {...props}
            inputRef={setRef}
            onChange={(event: any) => handleChange(event, field)}
            round={round}
            value={getValue(field)}></Styled.Input>
    )

    if (!control) {
        return renderInput({
            onChange,
            value,
        } as ControllerRenderProps<FieldValues, string>)
    }

    return (
        <Controller
            control={control}
            name={fieldName!}
            render={({ field }) => renderInput(field)}
        />
    )
}

export default forwardRef<HTMLDivElement | null | undefined, TextInputProps>(TextInput)
