import { autocompleteClasses } from '@mui/material/Autocomplete'
import styled from '@emotion/styled'

export const Option = styled.li`
    && {
        background-color: white;

        &[aria-selected='true'] {
            background-color: var(--colors-gray-80);

            &.${autocompleteClasses.focused} {
                background-color: var(--colors-gray-80);

                &:hover {
                    background-color: var(--colors-gray-90);
                }
            }
        }

        &:hover {
            background-color: var(--colors-gray-90);
        }
    }
`
