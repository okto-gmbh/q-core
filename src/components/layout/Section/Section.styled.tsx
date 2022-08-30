import styled from '@emotion/styled'
import { from } from '../../../utils/breakpoints'

export const Section = styled.div`
    padding: var(--spacing-default) 0;

    @media ${from.desktop} {
        padding: var(--spacing-huge) 0;
    }
`
