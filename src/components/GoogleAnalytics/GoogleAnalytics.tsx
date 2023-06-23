import Script from 'next/script'

import { getAnalyticsScript, getTagManagerUrl } from '../../utils/analytics'

import type { ScriptProps } from 'next/script'
import type { FC } from 'react'

type GoogleAnalyticsProps = {
    prodOnly: boolean
    id?: string
} & ScriptProps

const GoogleAnalytics: FC<GoogleAnalyticsProps> = ({
    id,
    prodOnly = true,
    strategy = 'worker'
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
