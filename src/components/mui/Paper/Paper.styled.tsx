import styled from '@emotion/styled'

import type { PaperProps } from '.'

const StyledPaper = ({
    borderRadius: _borderRadius,
    height: _height,
    overflow: _overflow,
    scroll: _scroll,
    width: _width,
    ...rest
}: PaperProps) => <div {...rest} />

export const Element = styled(StyledPaper)`
    position: relative;
    overflow: ${({ overflow }) => (overflow ? overflow : 'hidden')};
    width: ${({ width }) => (width ? width : 'auto')};
    height: ${({ height }) => (height ? height : undefined)};
    border-radius: ${({ borderRadius }) => (borderRadius ? borderRadius : 'var(--radii-default)')};
    background-color: var(--colors-white);
    box-shadow: var(--shadows-mui);
    overflow-x: ${({ scroll }) => (scroll === 'x' || scroll === 'all' ? 'auto' : undefined)};
    overflow-y: ${({ scroll }) => (scroll === 'y' || scroll === 'all' ? 'auto' : undefined)};
`
