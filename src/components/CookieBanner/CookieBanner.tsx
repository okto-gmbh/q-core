import React, { useEffect, useState } from 'react'
import * as Styled from './CookieBanner.styled'

export interface CookieBannerProps {
    text: React.ReactNode
    button: React.ReactNode
}

const CookieBanner = ({ text, button }: CookieBannerProps) => {
    const [accepted, setAccepted] = useState(true)

    useEffect(() => {
        setAccepted(localStorage.getItem('gdpr') === '1')
    }, [])

    const accept = () => {
        localStorage.setItem('gdpr', '1')
        setAccepted(true)
    }

    if (accepted) {
        return null
    }

    return (
        <Styled.Container>
            {text}
            <span
                onClick={() => accept()}
                onKeyPress={() => accept()}
                role="button"
                tabIndex={0}>
                {button}
            </span>
        </Styled.Container>
    )
}

export default CookieBanner
