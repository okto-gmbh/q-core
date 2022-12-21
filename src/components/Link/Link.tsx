import NextLink from 'next/link'
import { AnchorHTMLAttributes, FC } from 'react'

export interface LinkProps
    extends Partial<AnchorHTMLAttributes<HTMLAnchorElement>> {
    href: string
    next13?: boolean
}

const Link: FC<LinkProps> = ({ href, children, next13 = false, ...props }) => {
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

    if (next13) {
        return (
            <NextLink href={href} {...props}>
                {children}
            </NextLink>
        )
    }

    return (
        <NextLink href={href} {...props} passHref>
            <a className={props.className}>{children}</a>
        </NextLink>
    )
}

export default Link
