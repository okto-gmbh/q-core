import { SwitchProps as MuiSwitchProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import MaterialUISwitch, { switchClasses } from '@mui/material/Switch'

type SwitchProps = {
    [key: string]: any
    borderWidth: number
    buttonSize: number
    leftIcon: string
    leftIconActive: string
    offset: number
    outerHeight: number
    outerWidth: number
    rightIcon: string
    rightIconActive: string
}

export const Switch = styled(
    (props: MuiSwitchProps) => <MaterialUISwitch disableRipple {...props} />,
    {
        shouldForwardProp(prop: keyof (MuiSwitchProps & SwitchProps)) {
            return ![
                'leftIcon',
                'rightIcon',
                'leftIconActive',
                'rightIconActive',
                'borderWidth',
                'buttonSize',
                'offset',
                'outerHeight',
                'outerWidth'
            ].includes(prop as string)
        }
    }
)(
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
            height: `${outerHeight}px`,
            overflow: 'visible',
            padding: 0,
            width: `${outerWidth - offset}px`,

            [`.${switchClasses.track}`]: {
                '&::after': {
                    backgroundImage: `url('data:image/svg+xml;utf8,${rightIcon}')`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    content: "''",
                    height: `${outerHeight}px`,
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: `${outerHeight}px`
                },

                '&::before': {
                    backgroundImage: `url('data:image/svg+xml;utf8,${leftIcon}')`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    content: "''",
                    height: `${outerHeight}px`,
                    left: 0,
                    position: 'absolute',
                    top: 0,
                    width: `${outerHeight}px`
                },
                backgroundColor: 'var(--colors-white) !important',
                borderRadius: buttonSize,

                boxShadow: 'var(--shadows-mui)',

                opacity: '1 !important'
            },

            [`.${switchClasses.thumb}`]: {
                '&::before': {
                    backgroundImage: `url('data:image/svg+xml;utf8,${leftIconActive}')`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    content: "''",
                    height: '100%',
                    left: 0,
                    position: 'absolute',
                    top: 0,
                    width: '100%'
                },

                boxSizing: 'border-box',
                height: buttonSize,
                width: buttonSize
            },

            [`.${switchClasses.switchBase}`]: {
                color: 'var(--colors-primary)',
                margin: borderWidth * 2,
                padding: 0,

                [`&.${switchClasses.checked}`]: {
                    transform: `translateX(${outerHeight - offset}px)`,

                    [`.${switchClasses.thumb}`]: {
                        '&::before': {
                            backgroundImage: `url('data:image/svg+xml;utf8,${rightIconActive}')`
                        }
                    }
                }
            }
        }
    })
)
