import styled from '@emotion/styled'
import { autocompleteClasses } from '@mui/material/Autocomplete'
import { formLabelClasses } from '@mui/material/FormLabel'
import { inputBaseClasses } from '@mui/material/InputBase'
import { outlinedInputClasses } from '@mui/material/OutlinedInput'
import TextField from '@mui/material/TextField'

import { TextInputProps } from './TextInput'

const white = 'var(--colors-white)'
const primaryColor = 'var(--colors-primary)'

export const multilineLabelProps = {
    zIndex: '4 !important'
}

export const Input = styled(
    ({ grow: _grow, round: _round, ...props }: TextInputProps) => (
        <TextField {...props} variant="outlined" />
    )
)(({ grow, round }: { grow?: 'auto'; round?: boolean }) => ({
    [`& .${formLabelClasses.root}`]: {
        textShadow: '0 0 3px var(--colors-white)',
        zIndex: 1
    },

    [`& .${inputBaseClasses.root}`]: {
        '&:hover': {
            [`&:not(.${inputBaseClasses.disabled})`]: {
                [`& .${outlinedInputClasses.notchedOutline}`]: {
                    borderColor: primaryColor,
                    borderWidth: '1px'
                }
            }
        },

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

        [`& .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: 'var(--colors-white)',
            borderStyle: 'solid',
            borderWidth: '1px',
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
                          '> textarea': {
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                          },
                          position: 'relative',

                          zIndex: 3
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
