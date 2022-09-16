import React, { FC, LiHTMLAttributes } from 'react'
import * as Styled from './Option.styled'

const Option: FC<LiHTMLAttributes<HTMLLIElement>> = (props) => (
    <Styled.Option {...props} />
)

export default Option
