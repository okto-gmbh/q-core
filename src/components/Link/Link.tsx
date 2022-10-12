import NextLink from 'next/link'
import React, { AnchorHTMLAttributes, FC } from 'react'

interface LinkProps extends Partial<AnchorHTMLAttributes<HTMLAnchorElement>> {
    href: string
}

const Link: FC<LinkProps> = ({ href, children, ...props }) => {
    const external = /^(https?:\/\/|www\.)/.test(href)

    if (external) {
        return (
            <a
                href={href.startsWith('http') ? href : `https://${href}`}
                target="_blank"
                rel="noopener noreferrer"
                {...props}>
                {children}
            </a>
        )
    }

    return (
        <NextLink href={href} {...props} passHref>
            <a>{children}</a>
        </NextLink>
    )
}

export default Link
