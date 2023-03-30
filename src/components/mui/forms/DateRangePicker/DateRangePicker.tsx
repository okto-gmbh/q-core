import { TextFieldProps } from '@mui/material'
import {
    DateRange,
    DateRangePicker as DateRangePickerMui,
    DateRangePickerProps as MuiDateRangePickerProps,
    PickersShortcutsItem
} from '@mui/x-date-pickers-pro'
import { Dayjs } from 'dayjs'
import { FC, forwardRef } from 'react'
import {
    Control,
    Controller,
    ControllerRenderProps,
    FieldValues
} from 'react-hook-form'

import TextInput from '../TextInput'

type DateRangePickerProps = Omit<
    MuiDateRangePickerProps<Dayjs>,
    'renderInput'
> & {
    fieldName: string
    control?: Control<FieldValues>
    error?: boolean
    helperText?: string
    label?: string
    mask?: string
    shortcuts?: PickersShortcutsItem<DateRange<Date>>[]
}

const DateRangePicker: FC<DateRangePickerProps> = ({
    label,
    fieldName,
    control,
    onChange,
    shortcuts,
    error,
    helperText,
    ...props
}) => {
    const handleChange = (
        range: any[],
        field: ControllerRenderProps<FieldValues, string>
    ) => {
        field.onChange(range)

        if (control && onChange) {
            ;(onChange as any)(field.name, range, {
                shouldDirty: true,
                shouldValidate: true
            })
        }
    }

    let slotProps: any = undefined
    if (shortcuts) {
        slotProps = {
            shortcuts: {
                items: shortcuts
            }
        }
    }

    const renderPicker = (
        field: ControllerRenderProps<FieldValues, string>
    ) => (
        <DateRangePickerMui
            localeText={{ end: '', start: label }}
            onAccept={(range) => handleChange(range, field)}
            slotProps={slotProps}
            slots={{
                /*
                field: forwardRef(function SingleInputDateRange(props, ref) {
                    return <SingleInputDateRangeField {...props} ref={ref} />
                }),
                */
                fieldSeparator: () => null,
                textField: forwardRef(function TextField(
                    params: TextFieldProps,
                    ref: any
                ) {
                    return (
                        <TextInput
                            {...params}
                            ref={ref}
                            error={error}
                            onKeyDown={(e) => e.preventDefault()}
                            helperText={helperText}
                        />
                    )
                })
            }}
            {...props}
        />
    )

    if (!control) {
        return renderPicker({
            onChange,
            value: props.value
        } as ControllerRenderProps<FieldValues, string>)
    }

    return (
        <Controller
            control={control}
            name={fieldName}
            render={({ field }) => renderPicker(field)}
        />
    )
}

export default DateRangePicker
