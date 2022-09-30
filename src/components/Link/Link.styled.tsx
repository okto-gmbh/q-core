import styled from '@emotion/styled'

export const Element = styled.a`
    transition: color var(--motion-default);

    :any-link {
        color: var(--link-color);
        outline: none;
        text-decoration: none;
    }

    :hover,
    :focus,
    :active {
        color: var(--link-colorHover);
    }
`
