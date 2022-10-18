import styled from '@emotion/styled'
import { SafeAreaProps } from './SafeArea'

export const SafeArea = styled.div<SafeAreaProps>`
    position: relative;

    ${({ paddings }) => `
        ${paddings?.top ? 'padding-top: env(safe-area-inset-top);' : ''}
        ${paddings?.right ? 'padding-right: env(safe-area-inset-right);' : ''}
        ${
            paddings?.bottom
                ? 'padding-bottom: env(safe-area-inset-bottom);'
                : ''
        }
        ${paddings?.left ? 'padding-left: env(safe-area-inset-left);' : ''}
    `}
`
