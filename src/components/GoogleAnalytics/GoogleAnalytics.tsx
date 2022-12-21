import Script, { ScriptProps } from 'next/script'
import { FC } from 'react'

import { getAnalyticsScript, getTagManagerUrl } from '../../utils/analytics'

type GoogleAnalyticsProps = {
    id?: string
} & ScriptProps

const GoogleAnalytics: FC<GoogleAnalyticsProps> = ({
    id,
    strategy = 'worker'
}) =>
    (id && process.env.NODE_ENV === 'production' && (
        <>
            <Script src={getTagManagerUrl(id)} strategy={strategy} />
            <Script id="google-analytics" strategy={strategy}>
                {getAnalyticsScript(id)}
            </Script>
        </>
    )) ||
    null

export default GoogleAnalytics
