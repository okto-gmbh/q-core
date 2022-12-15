import { SwitchProps as MuiSwitchProps } from '@mui/material'
import { FC } from 'react'
import ReactDOMServer from 'react-dom/server'

import * as Styled from './Switch.styled'

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
