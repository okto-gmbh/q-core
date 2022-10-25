import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { until } from '../../utils/breakpoints'
import { SVGIconProps } from './SVGIcon'

export const Container = styled.div<SVGIconProps>`
    --_width: var(
        --icon-${({ size }) => size}-width,
        var(--icon-default-width, 24px)
    );
    --_height: var(
        --icon-${({ size }) => size}-height,
        var(--icon-default-height, 24px)
    );

    ${({ breakpoints }) =>
        css`
            ${breakpoints &&
            Object.entries(breakpoints)
                .map(
                    ([breakpoint, { size }]) => `
                    @media ${until[breakpoint]} {
                        --_width: var(--icon-${size}-width);
                        --_height: var(--icon-${size}-height);
                    }
                `
                )
                .join('\n')}
        `}

    display: inline-flex;
    width: var(--_width);
    height: var(--_height);
`
