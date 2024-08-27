import NextLink from 'next/link'

import type { AnchorHTMLAttributes, FC } from 'react'

export interface LinkProps extends Partial<AnchorHTMLAttributes<HTMLAnchorElement>> {
    href: string
    next13?: boolean
}

const Link: FC<LinkProps> = ({ children, href, ...props }) => {
    const external = /^(https?:\/\/|www\.)/.test(href)

    if (external) {
        return (
            <a
                href={href.startsWith('http') ? href : `https://${href}`}
                rel="noopener noreferrer"
                target="_blank"
                {...props}>
                {children}
            </a>
        )
    }

    return (
        <NextLink href={href} {...props}>
            {children}
        </NextLink>
    )
}

export default Link
