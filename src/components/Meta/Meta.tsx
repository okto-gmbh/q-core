import { DefaultSeo, NextSeo, NextSeoProps } from 'next-seo'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

type MetaProps = NextSeoProps & {
    siteName: string
    appBaseUrl: string
    image: string
    themeColor: string
}

const Meta: FC<MetaProps> = ({
    siteName,
    appBaseUrl,
    title = 'q-core',
    description = 'q-core',
    image = '/android-chrome-512x512.png',
    themeColor = '#111111',
    noindex = false,
    nofollow = false
}) => {
    const { asPath, locale: currentLocale, locales } = useRouter()

    return (
        <>
            <DefaultSeo
                defaultTitle={title}
                languageAlternates={locales
                    ?.filter((locale) => locale !== currentLocale)
                    .map((locale) => ({
                        hrefLang: locale,
                        href: `${appBaseUrl}/${locale}${asPath}`
                    }))}
                openGraph={{
                    description: description,
                    locale: currentLocale,
                    url: `${appBaseUrl}${asPath}`,
                    images: [
                        {
                            url: image
                        }
                    ],
                    site_name: siteName
                }}
            />
            <NextSeo noindex={noindex} nofollow={nofollow} />
            <Head>
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link rel="manifest" href="/site.webmanifest" />
                <meta name="msapplication-TileColor" content={themeColor} />
                <meta name="theme-color" content={themeColor} />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, viewport-fit=cover"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href={`/favicon-32x32.png`}
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href={`/favicon-16x16.png`}
                />
                <link rel="shortcut icon" href={`/favicon.ico`} />
            </Head>
        </>
    )
}

export default Meta
