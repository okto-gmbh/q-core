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
    ({ round: _round, grow: _grow, ...props }: TextInputProps) => (
        <TextField {...props} variant="outlined" />
    )
)(({ round, grow }: { grow?: 'auto'; round?: boolean }) => ({
    [`& .${formLabelClasses.root}`]: {
        zIndex: 1,
        textShadow: '0 0 3px white'
    },

    [`& .${inputBaseClasses.root}`]: {
        '&:hover': {
            [`&:not(.${inputBaseClasses.disabled})`]: {
                [`& .${outlinedInputClasses.notchedOutline}`]: {
                    borderWidth: '1px',
                    borderColor: primaryColor
                }
            }
        },
        padding: round ? '0 var(--spacings-default)' : undefined,
        borderRadius: round ? 'var(--spacings-huge)' : 'var(--radii-default)',
        backgroundColor: white,

        boxShadow: 'var(--shadows-mui)',

        [`&.${autocompleteClasses.inputRoot}`]: {
            backgroundColor: white
        },

        [`& .${inputBaseClasses.input}`]: {
            textOverflow: 'ellipsis'
        },

        [`& .${outlinedInputClasses.notchedOutline}`]: {
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--colors-white)',
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
                    borderWidth: '1px',
                    borderColor: primaryColor
                }
            },

            [`&.${inputBaseClasses.multiline}`]: {
                zIndex: 3
            }
        }
    }
}))
