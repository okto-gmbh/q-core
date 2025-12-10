import Script from 'next/script'

import { getAnalyticsScript, getTagManagerUrl } from '../../utils/analytics'

import type { ScriptProps } from 'next/script'
import type { FC } from 'react'

type GoogleAnalyticsProps = ScriptProps & {
    id?: string
    prodOnly?: boolean
}

const GoogleAnalytics: FC<GoogleAnalyticsProps> = ({
    id,
    prodOnly = true,
    strategy = 'afterInteractive',
}) =>
    (id && (!prodOnly || process.env.NODE_ENV === 'production') && (
        <>
            <Script src={getTagManagerUrl(id)} strategy={strategy} />
            <Script id="google-analytics" strategy={strategy}>
                {getAnalyticsScript(id)}
            </Script>
        </>
    )) ||
    null

export default GoogleAnalytics
