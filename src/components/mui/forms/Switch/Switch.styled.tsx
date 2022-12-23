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
            overflow: 'visible',
            width: `${outerWidth - offset}px`,
            height: `${outerHeight}px`,
            padding: 0,

            [`.${switchClasses.switchBase}`]: {
                padding: 0,
                margin: borderWidth * 2,
                color: 'var(--colors-secondary)',

                [`&.${switchClasses.checked}`]: {
                    transform: `translateX(${outerHeight - offset}px)`,

                    [`.${switchClasses.thumb}`]: {
                        '&::before': {
                            backgroundImage: `url('data:image/svg+xml;utf8,${rightIconActive}')`
                        }
                    }
                }
            },

            [`.${switchClasses.thumb}`]: {
                '&::before': {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url('data:image/svg+xml;utf8,${leftIconActive}')`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    content: "''"
                },

                width: buttonSize,
                height: buttonSize,
                boxSizing: 'border-box'
            },

            [`.${switchClasses.track}`]: {
                '&::after': {
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: `${outerHeight}px`,
                    height: `${outerHeight}px`,
                    backgroundImage: `url('data:image/svg+xml;utf8,${rightIcon}')`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    content: "''"
                },

                '&::before': {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${outerHeight}px`,
                    height: `${outerHeight}px`,
                    backgroundImage: `url('data:image/svg+xml;utf8,${leftIcon}')`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    content: "''"
                },
                borderRadius: buttonSize,
                backgroundColor: 'var(--colors-white) !important',

                boxShadow: 'var(--shadows-mui)',

                opacity: '1 !important'
            }
        }
    })
)
