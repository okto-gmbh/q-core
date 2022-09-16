import styled from '@emotion/styled'
import { autocompleteClasses } from '@mui/material/Autocomplete'
import { formLabelClasses } from '@mui/material/FormLabel'
import { inputBaseClasses } from '@mui/material/InputBase'
import { outlinedInputClasses } from '@mui/material/OutlinedInput'
import TextField from '@mui/material/TextField'
import React from 'react'
import { TextInputProps } from './TextInput'

const white = 'var(--colors-white)'
const primaryColor = 'var(--colors-primary)'

export const multilineLabelProps = {
    zIndex: '4 !important'
}

export const Input = styled(
    ({ round: _round, grow: _grow, ...props }: TextInputProps) => (
        <TextField {...props} variant="outlined" />
    )
)(({ round, grow }: { round?: boolean; grow?: 'auto' }) => ({
    [`& .${formLabelClasses.root}`]: {
        textShadow: '0px 0px 3px white',
        zIndex: 1
    },

    [`& .${inputBaseClasses.root}`]: {
        backgroundColor: white,
        borderRadius: round ? 'var(--spacings-huge)' : 'var(--radii-default)',
        boxShadow: 'var(--shadows-mui)',
        padding: round ? '0 var(--spacings-default)' : undefined,

        [`&.${autocompleteClasses.inputRoot}`]: {
            backgroundColor: white
        },

        [`& .${inputBaseClasses.input}`]: {
            textOverflow: 'ellipsis'
        },

        '&:hover': {
            [`&:not(.${inputBaseClasses.disabled})`]: {
                [`& .${outlinedInputClasses.notchedOutline}`]: {
                    borderColor: primaryColor,
                    borderWidth: '1px'
                }
            }
        },

        [`& .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: 'var(--colors-white)',
            borderWidth: '1px',
            borderStyle: 'solid',
            transition: 'border 0.2s ease-in'
        },

        [`&.${inputBaseClasses.disabled} .${outlinedInputClasses.notchedOutline}`]:
            {
                borderColor: white
            },

        [`&:not(.${inputBaseClasses.focused})`]: {
            [`&.${inputBaseClasses.multiline}`]:
                grow !== 'auto'
                    ? {
                          position: 'relative',
                          zIndex: 3,

                          '> textarea': {
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis'
                          }
                      }
                    : undefined
        },

        [`&.${inputBaseClasses.focused}`]: {
            [`&:not(.${inputBaseClasses.disabled})`]: {
                [`& .${outlinedInputClasses.notchedOutline}`]: {
                    borderColor: primaryColor,
                    borderWidth: '1px'
                }
            },

            [`&.${inputBaseClasses.multiline}`]: {
                zIndex: 3
            }
        }
    }
}))
