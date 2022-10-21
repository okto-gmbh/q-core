import styled from '@emotion/styled'
import { from } from '../../utils/breakpoints'
import ButtonCore from '../Button'
import Stack from '../layout/Stack'
import LinkCore from '../Link'

export const Container = styled(Stack)`
    --_backgroundColor: var(
        --cookieBanner-backgroundColor,
        var(--colors-primary)
    );
    --_color: var(--cookieBanner-color, var(--colors-white));

    position: fixed;
    z-index: 1000;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: var(--spacings-default);
    background-color: var(--_backgroundColor);
    color: var(--_color);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    @media ${from.mobileLandscape} {
        padding: var(--spacings-large);
    }
`

export const Button = styled(ButtonCore)`
    --_colorHover: var(--cookieBanner-color, var(--colors-white));
`

export const Link = styled(LinkCore)`
    &:hover {
        color: var(--cookieBanner-color, var(--colors-white));
    }
`
