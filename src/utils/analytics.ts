declare global {
    interface Window {
        gtag: (type: string, action: string, data: any) => void
    }
}

export const pageview = (gaId: string, url: string): void => {
    window.gtag('config', gaId, {
        page_path: url,
    })
}

export const event = ({
    action,
    category,
    label,
    value,
}: {
    action: string
    category: string
    label: string
    value: string
}): void => {
    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value,
    })
}

export const getTagManagerUrl = (gaId: string): string =>
    `https://www.googletagmanager.com/gtag/js?id=${gaId}`

export const getAnalyticsScript = (
    gaId: string
): string => `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', {
    page_path: document.location.pathname
});`
