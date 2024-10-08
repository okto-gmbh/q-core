import FormHelperText from '@mui/material/FormHelperText'
import Switch from '@mui/material/Switch'
import { Controller } from 'react-hook-form'

import * as Styled from './Checkbox.styled'

import type { SwitchProps } from '@mui/material'
import type { FC } from 'react'
import type { Control, ControllerRenderProps, FieldValues } from 'react-hook-form'

type CheckboxProps = SwitchProps & {
    fieldName: string
    label: string
    onChange: (name: string, value: boolean, options: any) => void
    control?: Control<FieldValues>
    defaultValue?: boolean
    error?: boolean
    helperText?: string
    value?: boolean
}

const Checkbox: FC<CheckboxProps> = ({
    control,
    defaultValue = false,
    error,
    fieldName,
    helperText,
    label,
    onChange,
    ...props
}) => {
    const handleChange = (value: boolean, field: ControllerRenderProps<FieldValues, string>) => {
        field.onChange(value)

        if (control) {
            onChange(field.name, value, {
                shouldDirty: true,
                shouldValidate: true,
            })
        }
    }

    const renderCheckbox = (field: ControllerRenderProps<FieldValues, string>) => (
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
            onChange,
            value: props.value,
        } as ControllerRenderProps<FieldValues, string>)
    }

    return (
        <Controller
            control={control}
            defaultValue={defaultValue}
            name={fieldName}
            render={({ field }) => renderCheckbox(field)}
        />
    )
}

export default Checkbox
