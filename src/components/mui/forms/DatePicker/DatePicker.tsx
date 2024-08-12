import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers-pro'
import { forwardRef } from 'react'
import { Controller } from 'react-hook-form'

import Paper from '../../Paper'
import TextInput from '../TextInput'

import type { FC } from 'react'
import type {
    Control,
    ControllerRenderProps,
    FieldValues
} from 'react-hook-form'

import type { TextFieldProps } from '@mui/material'
import type { DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers-pro'

type DatePickerProps = Omit<MuiDatePickerProps<Date>, 'renderInput'> & {
    control?: Control<FieldValues>
    error?: boolean
    fieldName?: string
    helperText?: string
    mask?: string
}

const DatePicker: FC<DatePickerProps> = ({
    control,
    error,
    fieldName,
    helperText,
    label,
    onChange,
    value,
    ...props
}) => {
    const handleChange = (
        date: Date | null,
        field: ControllerRenderProps<FieldValues, string>
    ) => {
        field.onChange(date)

        if (control && onChange) {
            ;(onChange as any)(field.name, date, {
                shouldDirty: true,
                shouldValidate: true
            })
        }
    }

    const renderPicker = (
        field: ControllerRenderProps<FieldValues, string>
    ) => (
        <div>
            <MuiDatePicker
                value={field.value ? new Date(field.value) : null}
                label={label}
                format="dd.MM.yyyy"
                slots={{
                    desktopPaper: Paper,
                    textField: forwardRef(function TextField(
                        inputProps: TextFieldProps,
                        ref: any
                    ) {
                        return (
                            <TextInput
                                {...inputProps}
                                ref={ref}
                                style={{ width: '100%' }}
                                onBlur={(e) => {
                                    const value = e.target.value
                                    const format = (
                                        props.format || 'DD.MM.YYYY'
                                    ).toUpperCase()

                                    if (value === format) {
                                        return handleChange(null, field)
                                    }

                                    const parts = value.split('.')
                                    if (parts.length !== 3) {
                                        return handleChange(null, field)
                                    }

                                    const [day, month, year] = parts
                                    const date = new Date()
                                    handleChange(
                                        new Date(
                                            parseInt(
                                                year ||
                                                    String(date.getFullYear())
                                            ),
                                            parseInt(
                                                month ||
                                                    String(date.getMonth() + 1)
                                            ) - 1,
                                            parseInt(
                                                day || String(date.getDate())
                                            )
                                        ),
                                        field
                                    )
                                }}
                                error={error}
                                helperText={helperText}
                            />
                        )
                    })
                }}
                {...props}
                onAccept={(date) => handleChange(date, field)}
            />
        </div>
    )

    if (!control) {
        return renderPicker({
            onChange,
            value
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
