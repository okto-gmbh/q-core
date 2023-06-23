import * as Styled from './Heading.styled'

import type { FC, HTMLAttributes } from 'react'

type Headings = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
export interface HeadingProps
    extends Partial<HTMLAttributes<HTMLHeadingElement>> {
    displayAs: Headings
    as?: Headings | any
}

const Heading: FC<HeadingProps> = ({ as = 'h1', displayAs, ...props }) => {
    if (!displayAs) {
        if (
            typeof as === 'string' &&
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(as)
        ) {
            displayAs = as as Headings
        } else {
            displayAs = 'h1'
        }
    }

    return <Styled.Element as={as} displayAs={displayAs} {...props} />
}

export default Heading
