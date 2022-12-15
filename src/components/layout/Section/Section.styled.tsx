import styled from '@emotion/styled'

import { from } from '../../../utils/breakpoints'

export const Section = styled.div`
    padding: var(--spacings-default) 0;

    @media ${from.desktopS} {
        padding: var(--spacings-huge) 0;
    }
`
