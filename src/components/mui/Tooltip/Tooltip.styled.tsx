import styled from '@emotion/styled'
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip'
import React from 'react'

export const Element = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip arrow {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'var(--colors-white)',
        color: 'var(--colors-black)',
        boxShadow: 'var(--shadows-mui)'
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: 'var(--colors-white)'
    }
}))
