import { TextFieldProps } from '@mui/material'
import {
    DatePicker as MuiDatePicker,
    DatePickerProps as MuiDatePickerProps
} from '@mui/x-date-pickers-pro'
import { FC, forwardRef, useState } from 'react'
import {
    Control,
    Controller,
    ControllerRenderProps,
    FieldValues
} from 'react-hook-form'

import TextInput from '../TextInput'

type DatePickerProps = Omit<MuiDatePickerProps<Date>, 'renderInput'> & {
    control?: Control<FieldValues>
    error?: boolean
    fieldName?: string
    helperText?: string
    mask?: string
}

const DatePicker: FC<DatePickerProps> = ({
    label,
    fieldName,
    control,
    onChange,
    error,
    helperText,
    value,
    ...props
}) => {
    const [open, setOpen] = useState(false)

    const handleChange = (
        date: Date | null,
        field: ControllerRenderProps<FieldValues, string>
    ) => {
        // field.onChange(date)

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
        <MuiDatePicker
            value={field.value ? new Date(field.value) : null}
            label={label}
            format="dd.MM.yyyy"
            open={open}
            slots={{
                textField: forwardRef(function TextField(
                    params: TextFieldProps,
                    ref: any
                ) {
                    return (
                        <TextInput
                            {...params}
                            ref={ref}
                            onKeyDown={(e) => e.preventDefault()}
                            onFocus={() => setOpen(true)}
                            error={error}
                            helperText={helperText}
                        />
                    )
                })
            }}
            {...props}
            onAccept={(date: Date | null) => {
                handleChange(date, field)
                setOpen(false)
            }}
        />
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
