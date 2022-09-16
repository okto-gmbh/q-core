import { SwitchProps as MuiSwitchProps } from '@mui/material'
import React, { FC } from 'react'
import ReactDOMServer from 'react-dom/server'
import * as Styled from './Switch.styled'

type SwitchProps = MuiSwitchProps & {
    label: string
    error: boolean | undefined
    defaultValue: boolean
    helperText: string | undefined
    onChange: (name: string, value: boolean, options: any) => void
    fieldName: string
    value: boolean
    leftIcon: JSX.Element
    rightIcon: JSX.Element
    leftIconActive: JSX.Element
    rightIconActive: JSX.Element
    borderWidth: number
    buttonSize: number
}

const Switch: FC<SwitchProps> = ({
    leftIcon,
    leftIconActive,
    rightIcon,
    rightIconActive,
    borderWidth = 2,
    buttonSize = 48,
    ...props
}) => {
    const offset = 4 * borderWidth
    const outerHeight = buttonSize + offset
    const outerWidth = outerHeight * 2

    return (
        <Styled.Switch
            borderWidth={borderWidth}
            buttonSize={buttonSize}
            offset={offset}
            outerWidth={outerWidth}
            outerHeight={outerHeight}
            leftIcon={ReactDOMServer.renderToStaticMarkup(leftIcon)}
            leftIconActive={ReactDOMServer.renderToStaticMarkup(leftIconActive)}
            rightIcon={ReactDOMServer.renderToStaticMarkup(rightIcon)}
            rightIconActive={ReactDOMServer.renderToStaticMarkup(
                rightIconActive
            )}
            {...props}
        />
    )
}

export default Switch
