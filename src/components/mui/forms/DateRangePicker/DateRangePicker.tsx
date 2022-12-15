import { TextFieldProps } from '@mui/material'
import {
    DateRangePicker as DateRangePickerMui,
    DateRangePickerProps as MuiDateRangePickerProps
} from '@mui/x-date-pickers-pro/DateRangePicker'
import { FC, useRef } from 'react'
import {
    Control,
    Controller,
    ControllerRenderProps,
    FieldValues
} from 'react-hook-form'

import TextInput from '../TextInput'

import * as Styled from './DateRangePicker.styled'

type DateRangePickerProps = Omit<
    MuiDateRangePickerProps<TextFieldProps, any>,
    'renderInput'
> & {
    fieldName: string
    control?: Control<FieldValues>
    error?: boolean
    helperText?: string
    mask?: string
}

const DateRangePicker: FC<DateRangePickerProps> = ({
    label,
    fieldName,
    control,
    onChange,
    error,
    helperText,
    ...props
}) => {
    const ref = useRef<HTMLInputElement>()

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

    const focus = () => {
        if (!ref.current) return

        ref.current.focus()
    }

    const renderPicker = (
        field: ControllerRenderProps<FieldValues, string>
    ) => (
        <DateRangePickerMui
            startText={label}
            onChange={(range) => handleChange(range, field)}
            renderInput={({ inputProps, ...startProps }, endProps) => {
                const { value: startValue, ...restInputProps } = inputProps!
                const endValue = endProps.inputProps!.value

                return (
                    <TextInput
                        fullWidth
                        {...startProps}
                        ref={ref}
                        InputProps={{
                            endAdornment: <Styled.Icon onClick={focus} />
                        }}
                        inputProps={restInputProps}
                        value={
                            startValue || endValue
                                ? `${startValue} - ${endValue}`
                                : ''
                        }
                        error={error}
                        helperText={helperText}
                    />
                )
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
