import { inputBaseClasses, outlinedInputClasses } from '@mui/material'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers-pro'
import { Controller } from 'react-hook-form'

import Paper from '../../Paper'

import type { DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers-pro'
import type { FC } from 'react'
import type { Control, ControllerRenderProps, FieldValues } from 'react-hook-form'

type DatePickerProps = Omit<MuiDatePickerProps<Date>, 'renderInput'> & {
    control?: Control<FieldValues>
    error?: boolean
    fieldName?: string
    helperText?: string
    mask?: string
    width?: 'auto' | 'full'
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
    const handleChange = (date: Date | null, field: ControllerRenderProps<FieldValues, string>) => {
        field.onChange(date)

        if (control && onChange) {
            ;(onChange as any)(field.name, date, {
                shouldDirty: true,
                shouldValidate: true,
            })
        }
    }

    const renderPicker = (field: ControllerRenderProps<FieldValues, string>) => (
        <div>
            <MuiDatePicker
                format="dd.MM.yyyy"
                label={label}
                onChange={(value) => {
                    handleChange(value, field)
                }}
                slotProps={{
                    textField: {
                        error,
                        helperText,
                        sx: {
                            [`& .${inputBaseClasses.input}`]: {
                                width: props.width === 'full' ? '100%' : 'auto',
                            },
                            [`& .${inputBaseClasses.root}`]: {
                                '&:hover, &:active, &:focus': {
                                    [`& .${outlinedInputClasses.notchedOutline}`]: {
                                        borderColor: 'var(--colors-primary)',
                                        borderWidth: '1px',
                                    },
                                },
                                backgroundColor: 'var(--colors-white)',
                                border: 0,
                                width: '100%',
                            },
                            [`& .${outlinedInputClasses.notchedOutline}`]: {
                                borderColor: 'transparent',
                                borderWidth: '1px !important',
                                transition: 'border-color 0.2s ease-in',
                            },
                            width: '100%',
                        },
                        variant: 'outlined',
                    },
                }}
                slots={{
                    desktopPaper: Paper,
                }}
                value={field.value ? new Date(field.value) : null}
                {...props}
                onAccept={(date) => handleChange(date, field)}
            />
        </div>
    )

    if (!control) {
        return renderPicker({
            onChange,
            value,
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
