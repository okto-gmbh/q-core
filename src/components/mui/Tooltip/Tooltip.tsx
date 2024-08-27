import * as Styled from './Tooltip.styled'

import type { TooltipProps } from '@mui/material/Tooltip'
import type { FC } from 'react'

const Tooltip: FC<TooltipProps> = (props) => <Styled.Element {...props} />

export default Tooltip
