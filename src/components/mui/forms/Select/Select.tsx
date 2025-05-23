'use client'

import { createFilterOptions } from '@mui/material/Autocomplete'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { Controller } from 'react-hook-form'

import { vars } from '../../../../utils/string'
import Paper from '../../Paper'
import Autocomplete, { Option } from '../Autocomplete'
import TextInput from '../TextInput'

import type { AutocompleteProps, FilterOptionsState, TextFieldProps } from '@mui/material'
import type { Ref } from 'react'
import type { Control, ControllerRenderProps, FieldValues } from 'react-hook-form'

const selectFilter = createFilterOptions()

export type SelectProps = AutocompleteProps<any, any, any, any> & {
    label: string
    onCreate: (value: any) => void
    onInputChange: (value: any) => void
    options: Array<{ key: string; value: string }>
    ref: Ref<HTMLInputElement>
    control?: Control<FieldValues>
    createLabel?: string
    error?: boolean
    fieldName?: string
    helperText?: string
    limitTags?: number
    multiple?: boolean
    slotProps?: AutocompleteProps<any, any, any, any>['slotProps'] & {
        textField: TextFieldProps['slotProps']
    }
}

const Select = ({
    control,
    createLabel,
    defaultValue,
    error,
    fieldName,
    helperText,
    label,
    limitTags = 2,
    multiple,
    onChange,
    onCreate,
    onInputChange,
    options,
    ref,
    ...props
}: SelectProps) => {
    const handleChange = (values: any[] | any, field: ControllerRenderProps<FieldValues, any>) => {
        field.onChange(values)

        if (control && onChange) {
            ;(onChange as any)(
                field.name,
                multiple ? (values as Array<{ key: string }>).map(({ key }) => key) : values?.key,
                {
                    shouldDirty: true,
                    shouldValidate: true,
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
                create: true,
                key: params.inputValue,
                // createLabel does not work in dev-env, as next-intl throws an error for the missing variable {label}
                // on prod, no error is thrown and the label can get replaced with its value
                value: vars(createLabel!, {
                    label: params.inputValue,
                }),
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

    const onSelectChange = async (values: any, field: ControllerRenderProps<FieldValues, any>) => {
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
                        value,
                    }
                })
            )

            if (multiple) {
                handleChange([...valuesToOptions(field.value), ...newOptions], field)
            } else {
                handleChange(newOptions[0], field)
            }
        } else {
            handleChange(values, field)
        }
    }

    const renderSelect = (field: ControllerRenderProps<FieldValues, any>) => (
        <Autocomplete
            PaperComponent={Paper}
            limitTags={limitTags}
            multiple={multiple}
            options={options}
            {...props}
            clearOnBlur={!!props.blurOnSelect}
            filterOptions={(options, params) => filterOptions(options, params, field)}
            getOptionLabel={({ value }) => value}
            onChange={(_, values) => onSelectChange(values, field)}
            ref={ref}
            renderInput={(params) => (
                <TextInput
                    {...params}
                    error={error}
                    helperText={helperText}
                    label={label}
                    onChange={onInputChange}
                    slotProps={{
                        // https://github.com/mui/material-ui/issues/43573#issuecomment-2364189702
                        ...props.slotProps?.textField,
                        htmlInput: {
                            ...params.inputProps,
                            ...props.slotProps?.textField?.htmlInput,
                        },
                        input: params.InputProps,
                        inputLabel: params.InputLabelProps,
                    }}
                    variant="filled"
                />
            )}
            renderOption={(props, { key, value }, { inputValue }) => {
                if (!value) return null

                const matches = match(value, inputValue)
                const parts = parse(value, matches)

                return (
                    <Option {...props} key={key || value}>
                        <div>
                            {parts?.map((part, index) => (
                                <span
                                    key={`${part.text}_${index}`}
                                    style={{
                                        fontWeight: part.highlight
                                            ? 'var(--fontWeights-bold)'
                                            : 'var(--fontWeights-default)',
                                    }}>
                                    {part.text}
                                </span>
                            ))}
                        </div>
                    </Option>
                )
            }}
            value={getValue(field.value ?? defaultValue)}
        />
    )

    if (!control) {
        return renderSelect({
            onChange,
            value: props.value,
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
    labelField = 'name',
    sort: boolean = true
): Array<{ key: string; value: string }> => {
    objects = objects.map(({ id, [labelField]: label }) => ({
        key: id,
        value: label,
    }))

    if (sort) {
        return objects.sort((a, b) => a.value.localeCompare(b.value))
    }

    return objects
}

export default Select
