import { NextSeo } from 'next-seo'
import Head from 'next/head'
import { useRouter } from 'next/router'

import type { NextSeoProps } from 'next-seo'
import type { FC } from 'react'

type MetaProps = NextSeoProps & {
    appBaseUrl: string
    image: string
    manifest: string
    siteName: string
    themeColor: string
}

const Meta: FC<MetaProps> = ({
    appBaseUrl,
    description = 'q-core',
    image = '/android-chrome-512x512.png',
    manifest = '/site.webmanifest',
    nofollow = false,
    noindex = false,
    siteName,
    themeColor = '#111111',
    title = 'q-core',
}) => {
    const { asPath, locale: currentLocale, locales } = useRouter()

    return (
        <>
            <NextSeo
                defaultTitle={title}
                description={description}
                languageAlternates={locales
                    ?.filter((locale) => locale !== currentLocale)
                    .map((locale) => ({
                        href: `${appBaseUrl}/${locale}${asPath}`,
                        hrefLang: locale,
                    }))}
                nofollow={nofollow}
                noindex={noindex}
                openGraph={{
                    description,
                    images: [
                        {
                            url: image,
                        },
                    ],
                    locale: currentLocale,
                    site_name: siteName,
                    url: `${appBaseUrl}${asPath}`,
                }}
            />
            <Head>
                <link crossOrigin="use-credentials" href={manifest} rel="manifest" />
                <meta content={themeColor} name="msapplication-TileColor" />
                <meta content={themeColor} name="theme-color" />
                <meta
                    content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, viewport-fit=cover user-scalable=no"
                    name="viewport"
                />
                <link href="/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
                <link href="/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
                <link href="/favicon.ico" rel="shortcut icon" />
            </Head>
        </>
    )
}

export default Meta
