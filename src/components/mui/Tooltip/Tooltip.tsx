import * as Styled from './Tooltip.styled'

import type { FC } from 'react'

import type { TooltipProps } from '@mui/material/Tooltip'

const Tooltip: FC<TooltipProps> = (props) => <Styled.Element {...props} />

export default Tooltip
