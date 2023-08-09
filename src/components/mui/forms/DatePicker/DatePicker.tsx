import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers-pro'
import { forwardRef, useRef } from 'react'
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
    const pickerRef = useRef<HTMLDivElement | null>()

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
        <div ref={(ref) => (pickerRef.current = ref)}>
            <MuiDatePicker
                value={field.value ? new Date(field.value) : null}
                label={label}
                format="dd.MM.yyyy"
                slotProps={{
                    popper: {
                        anchorEl: pickerRef.current
                    }
                }}
                slots={{
                    desktopPaper: Paper,
                    textField: forwardRef(function TextField(
                        props: TextFieldProps,
                        ref: any
                    ) {
                        return (
                            <TextInput
                                {...props}
                                ref={ref}
                                style={{ width: '100%' }}
                                onBlur={(e) => {
                                    const value = e.target.value

                                    if (value === 'DD.MM.YYYY') {
                                        return handleChange(null, field)
                                    }

                                    const [day, month, year] = value.split('.')
                                    if (!day || !month || !year) {
                                        return handleChange(null, field)
                                    }

                                    handleChange(
                                        new Date(
                                            parseInt(year),
                                            parseInt(month) - 1,
                                            parseInt(day)
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
