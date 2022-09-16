import React from 'react'
import { styled } from '@mui/material/styles'
import MaterialUISwitch, { switchClasses } from '@mui/material/Switch'
import { SwitchProps as MuiSwitchProps } from '@mui/material'

type SwitchProps = {
    leftIcon: string
    rightIcon: string
    leftIconActive: string
    rightIconActive: string
    offset: number
    outerHeight: number
    outerWidth: number
    borderWidth: number
    buttonSize: number
}

export const Switch = styled((props: MuiSwitchProps) => (
    <MaterialUISwitch disableRipple {...props} />
))(
    ({
        leftIcon,
        rightIcon,
        leftIconActive,
        rightIconActive,
        borderWidth,
        buttonSize,
        offset,
        outerHeight,
        outerWidth
    }: SwitchProps) => ({
        '&&': {
            width: `${outerWidth - offset}px`,
            height: `${outerHeight}px`,
            padding: 0,
            overflow: 'visible',

            [`.${switchClasses.switchBase}`]: {
                padding: 0,
                margin: borderWidth * 2,
                color: 'var(--colors-secondary)',

                [`&.${switchClasses.checked}`]: {
                    transform: `translateX(${outerHeight - offset}px)`,

                    [`.${switchClasses.thumb}`]: {
                        '&:before': {
                            backgroundImage: `url('data:image/svg+xml;utf8,${rightIconActive}')`
                        }
                    }
                }
            },

            [`.${switchClasses.thumb}`]: {
                boxSizing: 'border-box',
                width: buttonSize,
                height: buttonSize,

                '&:before': {
                    content: "''",
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    left: 0,
                    top: 0,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundImage: `url('data:image/svg+xml;utf8,${leftIconActive}')`
                }
            },

            [`.${switchClasses.track}`]: {
                borderRadius: buttonSize,
                backgroundColor: 'var(--colors-white) !important',
                opacity: '1 !important',
                boxShadow: 'var(--shadows-mui)',

                '&:before': {
                    content: "''",
                    position: 'absolute',
                    width: `${outerHeight}px`,
                    height: `${outerHeight}px`,
                    left: 0,
                    top: 0,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundImage: `url('data:image/svg+xml;utf8,${leftIcon}')`
                },

                '&:after': {
                    content: "''",
                    position: 'absolute',
                    width: `${outerHeight}px`,
                    height: `${outerHeight}px`,
                    right: 0,
                    top: 0,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundImage: `url('data:image/svg+xml;utf8,${rightIcon}')`
                }
            }
        }
    })
)
