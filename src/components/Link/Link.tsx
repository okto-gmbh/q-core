import React, { AnchorHTMLAttributes, FC } from 'react'
import NextLink from 'next/link'
import * as Styled from './Link.styled'

interface LinkProps extends Partial<AnchorHTMLAttributes<HTMLAnchorElement>> {
    href: string
}

const Link: FC<LinkProps> = ({ href, children, ...props }) => {
    const external = /^(https?:\/\/|www\.)/.test(href)

    if (external) {
        return (
            <Styled.Element
                href={href.startsWith('http') ? href : `https://${href}`}
                target="_blank"
                rel="noopener noreferrer"
                {...props}>
                {children}
            </Styled.Element>
        )
    }

    return (
        <NextLink href={href} {...props} passHref>
            <Styled.Element>{children}</Styled.Element>
        </NextLink>
    )
}

export default Link
