import styled from '@emotion/styled'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'

import type { TooltipProps } from '@mui/material/Tooltip'

export const Element = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip arrow {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: 'var(--colors-white)',
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'var(--colors-white)',
        boxShadow: 'var(--shadows-mui)',
        color: 'var(--colors-black)',
        fontSize: '1rem',
        padding: 'var(--spacings-medium)',
    },
}))
