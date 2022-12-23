import { AutocompleteProps } from '@mui/material'
import { FC } from 'react'

import * as Styled from './Autocomplete.styled'

const Autocomplete: FC<AutocompleteProps<any, any, any, any>> = (props) => (
    <Styled.Select
        {...props}
        PopperComponent={(props) => <Styled.Popper {...props} />}
    />
)

export default Autocomplete

export { default as Option } from './Option'
