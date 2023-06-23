import styled from '@emotion/styled'

import type { SafeAreaProps } from './SafeArea'

export const SafeArea = styled.div<SafeAreaProps>`
    position: relative;

    ${({ bottom, left, right, top }) => `
        ${top ? 'padding-top: env(safe-area-inset-top);' : ''}
        ${right ? 'padding-right: env(safe-area-inset-right);' : ''}
        ${bottom ? 'padding-bottom: env(safe-area-inset-bottom);' : ''}
        ${left ? 'padding-left: env(safe-area-inset-left);' : ''}
    `};
`
