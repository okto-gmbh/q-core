import { SwitchProps } from '@mui/material'
import FormHelperText from '@mui/material/FormHelperText'
import Switch from '@mui/material/Switch'
import React, { FC } from 'react'
import {
    Control,
    Controller,
    ControllerRenderProps,
    FieldValues
} from 'react-hook-form'
import * as Styled from './Checkbox.styled'

type CheckboxProps = SwitchProps & {
    label: string
    error?: boolean
    defaultValue?: boolean
    helperText?: string
    control?: Control<FieldValues>
    onChange: (name: string, value: boolean, options: any) => void
    fieldName: string
    value?: boolean
}

const Checkbox: FC<CheckboxProps> = ({
    label,
    error,
    helperText,
    control,
    onChange,
    fieldName,
    defaultValue = false,
    ...props
}) => {
    const handleChange = (
        value: boolean,
        field: ControllerRenderProps<FieldValues, string>
    ) => {
        field.onChange(value)

        if (control) {
            onChange(field.name, value, {
                shouldValidate: true,
                shouldDirty: true
            })
        }
    }

    const renderCheckbox = (
        field: ControllerRenderProps<FieldValues, string>
    ) => (
        <Styled.Control error={error}>
            <Styled.Group>
                <Styled.Label
                    control={<Switch checked={!!field.value} {...props} />}
                    label={label}
                    onChange={(e) => {
                        handleChange((e.target as any).checked, field)
                    }}
                />
            </Styled.Group>
            <FormHelperText>{helperText}</FormHelperText>
        </Styled.Control>
    )

    if (!control) {
        return renderCheckbox({
            value: props.value,
            onChange
        } as ControllerRenderProps<FieldValues, string>)
    }

    return (
        <Controller
            control={control}
            name={fieldName}
            render={({ field }) => renderCheckbox(field)}
            defaultValue={defaultValue}
        />
    )
}

export default Checkbox
