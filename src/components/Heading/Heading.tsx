import { ComponentType, FC, HTMLAttributes } from 'react'

import * as Styled from './Heading.styled'

type Headings = 'h1' | 'h2' | 'h3' | 'h4'
export interface HeadingProps
    extends Partial<HTMLAttributes<HTMLHeadingElement>> {
    displayAs: Headings
    as?: Headings | ComponentType<any>
}

const Heading: FC<HeadingProps> = ({ as = 'h1', displayAs, ...props }) => {
    if (!displayAs) {
        if (typeof as === 'string' && ['h1', 'h2', 'h3', 'h4'].includes(as)) {
            displayAs = as
        } else {
            displayAs = 'h1'
        }
    }

    return <Styled.Element as={as} displayAs={displayAs} {...props} />
}

export default Heading
