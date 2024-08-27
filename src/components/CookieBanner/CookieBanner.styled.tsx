import styled from '@emotion/styled'

import { from } from '../../utils/breakpoints'
import Stack from '../layout/Stack'

export const Container = styled(Stack)`
    --_backgroundColor: var(--cookieBanner-backgroundColor, var(--colors-gray-10));
    --_color: var(--cookieBanner-color, var(--colors-white));

    position: fixed;
    z-index: 1000;
    bottom: 0;
    left: 0;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    padding: var(--spacings-default);
    background-color: var(--_backgroundColor);
    color: var(--_color);
    text-align: center;

    @media ${from.mobileLandscape} {
        padding: var(--spacings-large);
    }
`
