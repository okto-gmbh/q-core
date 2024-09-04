import FormHelperText from '@mui/material/FormHelperText'
import MuiRadio from '@mui/material/Radio'
import { Controller } from 'react-hook-form'

import * as Styled from './Radio.styled'

import type { RadioGroupProps as MuiRadioGroupProps } from '@mui/material'
import type { FC } from 'react'
import type { Control, ControllerRenderProps, FieldValues } from 'react-hook-form'

type RadioProps = MuiRadioGroupProps & {
    fieldName: string
    onChange: (name: string, value: string, options: any) => void
    options: Array<{ key: string; value: string }>
    control?: Control<FieldValues>
    defaultValue?: string
    error?: boolean
    helperText?: string
    value?: string
}

const Radio: FC<RadioProps> = ({
    control,
    defaultValue,
    error,
    fieldName,
    helperText,
    onChange,
    options,
    ...props
}) => {
    const handleChange = (value: string, field: ControllerRenderProps<FieldValues, string>) => {
        field.onChange(value)

        if (control) {
            onChange(field.name, value, {
                shouldDirty: true,
                shouldValidate: true,
            })
        }
    }

    const renderRadioGroup = (field: ControllerRenderProps<FieldValues, string>) => (
        <Styled.Control error={error}>
            <Styled.Group
                onChange={(e) => {
                    handleChange((e.target as any).value, field)
                }}
                value={field.value}
                {...props}>
                {options.map((option, index) => (
                    <Styled.Label
                        control={<MuiRadio />}
                        key={`${option.key}-${index}`}
                        label={option.value}
                        value={option.key}
                    />
                ))}
            </Styled.Group>
            <FormHelperText>{helperText}</FormHelperText>
        </Styled.Control>
    )

    if (!control) {
        return renderRadioGroup({
            onChange,
            value: props.value,
        } as ControllerRenderProps<FieldValues, string>)
    }

    return (
        <Controller
            control={control}
            defaultValue={defaultValue}
            name={fieldName}
            render={({ field }) => renderRadioGroup(field)}
        />
    )
}

export default Radio
