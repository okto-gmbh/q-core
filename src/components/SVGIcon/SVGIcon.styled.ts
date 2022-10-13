import styled from '@emotion/styled'
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

    display: inline-flex;
    width: var(--_width);
    height: var(--_height);
`
