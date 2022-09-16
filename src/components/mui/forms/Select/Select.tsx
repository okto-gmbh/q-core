import { AutocompleteProps, FilterOptionsState } from '@mui/material'
import { createFilterOptions } from '@mui/material/Autocomplete'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import React, { forwardRef, Ref } from 'react'
import {
    Control,
    Controller,
    ControllerRenderProps,
    FieldValues
} from 'react-hook-form'
import { vars } from '../../../../utils/string'
import Paper from '../../Paper'
import Autocomplete, { Option } from '../Autocomplete'
import TextInput from '../TextInput'

const selectFilter = createFilterOptions()

type SelectProps = AutocompleteProps<any, any, any, any> & {
    limitTags?: number
    multiple?: boolean
    label: string
    error?: boolean
    helperText?: string
    control?: Control<FieldValues>
    createLabel?: string
    fieldName?: string
    options: Array<{ key: string; value: string }>
    onCreate: (value: any) => void
}

const Select = (
    {
        limitTags = 2,
        error,
        helperText,
        fieldName,
        multiple,
        control,
        options,
        onChange,
        onCreate,
        defaultValue,
        label,
        createLabel,
        ...props
    }: SelectProps,
    ref: Ref<HTMLInputElement>
) => {
    const handleChange = (
        values: any | any[],
        field: ControllerRenderProps<FieldValues, any>
    ) => {
        field.onChange(values)

        if (control && onChange) {
            ;(onChange as any)(
                field.name,
                multiple
                    ? (values as Array<{ key: string }>).map(({ key }) => key)
                    : values?.key,
                {
                    shouldValidate: true,
                    shouldDirty: true
                }
            )
        }
    }

    const filterOptions = (
        options: any[],
        params: FilterOptionsState<any>,
        field: ControllerRenderProps<FieldValues, any>
    ) => {
        const filtered = selectFilter(options, params)
        if (!onCreate) {
            return filtered
        }

        if (
            params.inputValue !== '' &&
            filtered.length === 0 &&
            !options.find((option) => option.value === params.inputValue) &&
            (multiple
                ? !(field.value || []).includes(params.inputValue)
                : field.value !== params.inputValue)
        ) {
            filtered.push({
                key: params.inputValue,
                value: vars(createLabel!, {
                    label: params.inputValue
                }),
                create: true
            })
        }

        return filtered
    }

    const valuesToOptions = (values: string[] = []) =>
        options.filter(({ key }) => values.includes(key))

    const getValue = (value: any) => {
        if (multiple) {
            return valuesToOptions(value)
        }

        return valuesToOptions([value])?.[0] || null
    }

    const onSelectChange = async (
        values: any,
        field: ControllerRenderProps<FieldValues, any>
    ) => {
        const createOptions = multiple
            ? values.filter(({ create }: { create?: boolean }) => create)
            : values?.create
            ? [values]
            : []

        if (createOptions.length > 0) {
            const newOptions = await Promise.all(
                createOptions.map(async ({ key: value }: { key: any }) => {
                    const key = await onCreate(value)
                    return {
                        key,
                        value
                    }
                })
            )

            if (multiple) {
                handleChange(
                    [...valuesToOptions(field.value), ...newOptions],
                    field
                )
            } else {
                handleChange(newOptions[0], field)
            }
        } else {
            handleChange(values, field)
        }
    }

    const renderSelect = (field: ControllerRenderProps<FieldValues, any>) => {
        return (
            <Autocomplete
                PaperComponent={Paper}
                multiple={multiple}
                limitTags={limitTags}
                options={options}
                {...props}
                value={getValue(field.value ?? defaultValue)}
                ref={ref}
                onChange={(_, values) => onSelectChange(values, field)}
                filterOptions={(options, params) =>
                    filterOptions(options, params, field)
                }
                getOptionLabel={({ value }) => value}
                renderInput={(params) => (
                    <TextInput
                        {...params}
                        label={label}
                        variant="filled"
                        error={error}
                        helperText={helperText}
                    />
                )}
                renderOption={(props, { value }, { inputValue }) => {
                    const matches = match(value, inputValue)
                    const parts = parse(value, matches)

                    return (
                        <Option {...props}>
                            <div>
                                {parts.map((part, index) => (
                                    <span
                                        key={`${part.text}_${index}`}
                                        style={{
                                            fontWeight: part.highlight
                                                ? 'var(--fontWeights-bold)'
                                                : 'var(--fontWeights-default)'
                                        }}>
                                        {part.text}
                                    </span>
                                ))}
                            </div>
                        </Option>
                    )
                }}
            />
        )
    }

    if (!control) {
        return renderSelect({
            value: props.value,
            onChange
        } as ControllerRenderProps<FieldValues, any>)
    }

    return (
        <Controller
            control={control}
            name={fieldName!}
            render={({ field }) => renderSelect(field)}
        />
    )
}

export const objectsToOptions = (
    objects: any[] = [],
    labelField = 'name'
): Array<{ key: string; value: string }> =>
    objects.map(({ id, [labelField]: label }) => ({
        key: id,
        value: label
    }))

export default forwardRef<HTMLInputElement, SelectProps>(Select)
