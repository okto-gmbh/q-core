import styled from '@emotion/styled'
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip'

export const Element = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip arrow {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'var(--colors-white)',
        boxShadow: 'var(--shadows-mui)',
        color: 'var(--colors-black)'
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: 'var(--colors-white)'
    }
}))
