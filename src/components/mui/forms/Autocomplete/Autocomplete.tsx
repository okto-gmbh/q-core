import * as Styled from './Autocomplete.styled'

import type { FC } from 'react'

import type { AutocompleteProps } from '@mui/material'

const Autocomplete: FC<AutocompleteProps<any, any, any, any>> = (props) => (
    <Styled.Select
        {...props}
        PopperComponent={(props) => <Styled.Popper {...props} />}
    />
)

export default Autocomplete

export { default as Option } from './Option'
