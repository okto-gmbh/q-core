import React, { useEffect, useState } from 'react'
import Typography from '../Typography'
import * as Styled from './CookieBanner.styled'

const CookieBanner = () => {
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
            <Typography>
                Wir verwenden Cookies, lesen Sie dazu hier unsere{' '}
                <Styled.Link href="/datenschutz">
                    Datenschutzerklärung.
                </Styled.Link>
            </Typography>
            <Styled.Button variant="primary" onClick={() => accept()}>
                akzeptieren
            </Styled.Button>
        </Styled.Container>
    )
}

export default CookieBanner
