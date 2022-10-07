import styled from '@emotion/styled'
import { SafeAreaProps } from './SafeArea'

export const SafeArea = styled.div<SafeAreaProps>`
    position: relative;

    ${(props) => {
        const paddingTop = props.paddings?.top
            ? 'padding-top: env(safe-area-inset-top);'
            : ''
        const paddingRight = props.paddings?.right
            ? 'padding-right: env(safe-area-inset-right);'
            : ''
        const paddingBottom = props.paddings?.bottom
            ? 'padding-bottom: env(safe-area-inset-bottom);'
            : ''
        const paddingLeft = props.paddings?.left
            ? 'padding-left: env(safe-area-inset-left);'
            : ''
        return `
            ${paddingTop}
            ${paddingRight}
            ${paddingBottom}
            ${paddingLeft}
        `
    }}
`
