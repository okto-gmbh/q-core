import Clear from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { createRef, FC } from 'react'

import TextInput, { TextInputProps } from '../TextInput'

type SearchInputProps = TextInputProps & {
    clear: () => void
}

const SearchInput: FC<SearchInputProps> = ({ value, clear, ...props }) => {
    const inputRef = createRef<HTMLInputElement>()

    const focus = () => {
        const input = inputRef.current
        if (input) {
            input.focus()
        }
    }

    return (
        <TextInput
            ref={inputRef}
            round
            hiddenLabel
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
                )
            }}
            {...props}
            value={value}
        />
    )
}

export default SearchInput
