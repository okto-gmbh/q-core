import styled from '@emotion/styled'
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete'
import { inputBaseClasses } from '@mui/material/InputBase'
import MuiPopper from '@mui/material/Popper'

export const Select = styled(Autocomplete)`
    && {
        z-index: 5;

        .${autocompleteClasses.inputRoot} {
            flex-wrap: nowrap;
        }

        &.${inputBaseClasses.focused} {
            .${autocompleteClasses.inputRoot} {
                flex-wrap: wrap;
            }
        }
    }
`

export const Popper = styled(MuiPopper)`
    && {
        .${autocompleteClasses.listbox} {
            padding: 0;
        }
    }
`
