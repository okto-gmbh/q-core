import styled from '@emotion/styled'

export const Element = styled.a`
    transition: color var(--transition-duration) var(--transition-ease);

    :any-link {
        color: var(--color-link);
        outline: none;
        text-decoration: none;
    }

    :hover,
    :focus,
    :active {
        color: var(--color-link-hover);
    }
`
