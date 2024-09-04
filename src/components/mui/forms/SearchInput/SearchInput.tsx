import Clear from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { createRef } from 'react'

import TextInput from '../TextInput'

import type { FC } from 'react'

import type { TextInputProps } from '../TextInput'

type SearchInputProps = TextInputProps & {
    clear: () => void
}

const SearchInput: FC<SearchInputProps> = ({ clear, value, ...props }) => {
    const inputRef = createRef<HTMLInputElement>()

    const focus = () => {
        const input = inputRef.current
        if (input) {
            input.focus()
        }
    }

    return (
        <TextInput
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            edge="end"
                            onClick={
                                value
                                    ? () => {
                                          clear()
                                          focus()
                                      }
                                    : focus
                            }>
                            {value ? <Clear /> : <SearchIcon />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            hiddenLabel
            ref={inputRef}
            round
            {...props}
            value={value}
        />
    )
}

export default SearchInput
