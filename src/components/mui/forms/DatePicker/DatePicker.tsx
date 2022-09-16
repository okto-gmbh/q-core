import {
    DatePicker as MuiDatePicker,
    DatePickerProps as MuiDatePickerProps
} from '@mui/x-date-pickers-pro'
import { TextFieldProps } from '@mui/material'
import React, { FC } from 'react'
import {
    Control,
    Controller,
    ControllerRenderProps,
    FieldValues
} from 'react-hook-form'
import TextInput from '../TextInput'

type DatePickerProps = Omit<MuiDatePickerProps<any, any>, 'renderInput'> & {
    error?: boolean
    helperText?: string
    control?: Control<FieldValues>
    fieldName?: string
    mask?: string
}

const DatePicker: FC<DatePickerProps> = ({
    label,
    fieldName,
    mask,
    control,
    onChange,
    error,
    helperText,
    value,
    ...props
}) => {
    const handleChange = (
        date: string,
        field: ControllerRenderProps<FieldValues, string>
    ) => {
        field.onChange(date)

        if (control && onChange) {
            ;(onChange as any)(field.name, date, {
                shouldValidate: true,
                shouldDirty: true
            })
        }
    }

    const renderPicker = (
        field: ControllerRenderProps<FieldValues, string>
    ) => (
        <MuiDatePicker
            value={field.value ?? ''}
            mask={mask ? mask : '__.__.____'}
            inputFormat="dd.MM.yyyy"
            label={label}
            renderInput={(params: TextFieldProps) => (
                <TextInput {...params} error={error} helperText={helperText} />
            )}
            {...props}
            onChange={(date) => handleChange(date, field)}
        />
    )

    if (!control) {
        return renderPicker({
            value,
            onChange
        } as ControllerRenderProps<FieldValues, string>)
    }

    return (
        <Controller
            control={control}
            name={fieldName!}
            render={({ field }) => renderPicker(field)}
        />
    )
}

export default DatePicker
