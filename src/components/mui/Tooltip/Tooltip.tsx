import { TooltipProps } from '@mui/material/Tooltip'
import { FC } from 'react'

import * as Styled from './Tooltip.styled'

const Tooltip: FC<TooltipProps> = (props) => <Styled.Element {...props} />

export default Tooltip
