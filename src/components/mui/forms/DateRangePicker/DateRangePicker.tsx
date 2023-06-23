import { DateRangePicker as DateRangePickerMui } from '@mui/x-date-pickers-pro'
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
import type {
    DateRange,
    DateRangePickerProps as MuiDateRangePickerProps,
    PickersShortcutsItem
} from '@mui/x-date-pickers-pro'

type DateRangePickerProps = Omit<
    MuiDateRangePickerProps<Date>,
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
    control,
    error,
    fieldName,
    helperText,
    label,
    onChange,
    shortcuts,
    ...props
}) => {
    let disabled = false
    if (
        !props.minDate ||
        props.minDate.getTime() === props.maxDate?.getTime()
    ) {
        disabled = true
    }

    const handleChange = (
        range: any[],
        field: ControllerRenderProps<FieldValues, string>
    ) => {
        try {
            field.onChange(range)

            if (control && onChange) {
                ;(onChange as any)(field.name, range, {
                    shouldDirty: true,
                    shouldValidate: true
                })
            }
        } catch (e) {
            // Ignore
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
            disabled={disabled}
            slots={{
                desktopPaper: Paper,
                /*
                field: forwardRef(function SingleInputDateRange(props, ref) {
                    return <SingleInputDateRangeField {...props} ref={ref} />
                }),
                */
                fieldSeparator: () => null,
                textField: forwardRef(function TextField(
                    props: TextFieldProps,
                    ref: any
                ) {
                    return (
                        <TextInput
                            {...props}
                            ref={ref}
                            error={error}
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
