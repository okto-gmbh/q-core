import ReactDOMServer from 'react-dom/server'

import * as Styled from './Switch.styled'

import type { SwitchProps as MuiSwitchProps } from '@mui/material'
import type { FC } from 'react'

type SwitchProps = MuiSwitchProps & {
    borderWidth: number
    buttonSize: number
    defaultValue: boolean
    error: boolean | undefined
    fieldName: string
    helperText: string | undefined
    label: string
    leftIcon: JSX.Element
    leftIconActive: JSX.Element
    onChange: (name: string, value: boolean, options: any) => void
    rightIcon: JSX.Element
    rightIconActive: JSX.Element
    value: boolean
}

const Switch: FC<SwitchProps> = ({
    borderWidth = 2,
    buttonSize = 48,
    leftIcon,
    leftIconActive,
    rightIcon,
    rightIconActive,
    ...props
}) => {
    const offset = 4 * borderWidth
    const outerHeight = buttonSize + offset
    const outerWidth = outerHeight * 2

    return (
        <Styled.Switch
            borderWidth={borderWidth}
            buttonSize={buttonSize}
            leftIcon={ReactDOMServer.renderToStaticMarkup(leftIcon)}
            leftIconActive={ReactDOMServer.renderToStaticMarkup(leftIconActive)}
            offset={offset}
            outerHeight={outerHeight}
            outerWidth={outerWidth}
            rightIcon={ReactDOMServer.renderToStaticMarkup(rightIcon)}
            rightIconActive={ReactDOMServer.renderToStaticMarkup(rightIconActive)}
            {...props}
        />
    )
}

export default Switch
