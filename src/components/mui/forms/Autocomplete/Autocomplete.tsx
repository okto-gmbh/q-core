'use client'

import * as Styled from './Autocomplete.styled'

import type { AutocompleteProps } from '@mui/material'
import type { FC } from 'react'

const Autocomplete: FC<AutocompleteProps<any, any, any, any>> = (props) => (
    <Styled.Select {...props} PopperComponent={(props) => <Styled.Popper {...props} />} />
)

export default Autocomplete

export { default as Option } from './Option'
