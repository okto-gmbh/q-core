import { RadioGroupProps as MuiRadioGroupProps } from '@mui/material'
import FormHelperText from '@mui/material/FormHelperText'
import MuiRadio from '@mui/material/Radio'
import { FC } from 'react'
import {
    Control,
    Controller,
    ControllerRenderProps,
    FieldValues
} from 'react-hook-form'

import * as Styled from './Radio.styled'

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
    error,
    helperText,
    control,
    onChange,
    fieldName,
    options,
    defaultValue,
    ...props
}) => {
    const handleChange = (
        value: string,
        field: ControllerRenderProps<FieldValues, string>
    ) => {
        field.onChange(value)

        if (control) {
            onChange(field.name, value, {
                shouldDirty: true,
                shouldValidate: true
            })
        }
    }

    const renderRadioGroup = (
        field: ControllerRenderProps<FieldValues, string>
    ) => (
        <Styled.Control error={error}>
            <Styled.Group
                value={field.value}
                onChange={(e) => {
                    handleChange((e.target as any).value, field)
                }}
                {...props}>
                {options.map((option, index) => (
                    <Styled.Label
                        key={`${option.key}-${index}`}
                        value={option.key}
                        control={<MuiRadio />}
                        label={option.value}
                    />
                ))}
            </Styled.Group>
            <FormHelperText>{helperText}</FormHelperText>
        </Styled.Control>
    )

    if (!control) {
        return renderRadioGroup({
            onChange,
            value: props.value
        } as ControllerRenderProps<FieldValues, string>)
    }

    return (
        <Controller
            control={control}
            name={fieldName}
            render={({ field }) => renderRadioGroup(field)}
            defaultValue={defaultValue}
        />
    )
}

export default Radio
