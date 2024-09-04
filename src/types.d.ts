import type { SimpleRolesIsAuthorized } from '@blitzjs/auth'

declare module '@blitzjs/auth' {
    export interface Session {
        isAuthorized: SimpleRolesIsAuthorized<string>
        PublicData: {
            role: string
            userId: string
            tenantId?: string
        }
    }
}

export type Breakpoint =
    | 'desktopL'
    | 'desktopM'
    | 'desktopS'
    | 'desktopXL'
    | 'mobileLandscape'
    | 'mobilePortrait'
    | 'tabletLandscape'
    | 'tabletPortrait'

export type Breakpoints = {
    [key in Breakpoint]: { [key: string]: string }
}

export type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5'

export type Color = 'black' | 'danger' | 'info' | 'primary' | 'success' | 'white'

export type Spacing = 'default' | 'huge' | 'large' | 'medium' | 'small' | 'tiny'

export type FontSize = 'default' | 'large' | 'medium' | 'small' | 'tiny'

export type FontWeight = '300' | '600'

export type Display =
    | 'block'
    | 'contents'
    | 'flex'
    | 'grid'
    | 'inherit'
    | 'initial'
    | 'inline-block'
    | 'inline-flex'
    | 'inline-grid'
    | 'inline-table'
    | 'inline'
    | 'list-item'
    | 'none'
    | 'run-in'
    | 'table-caption'
    | 'table-cell'
    | 'table-column-group'
    | 'table-column'
    | 'table-footer-group'
    | 'table-header-group'
    | 'table-row-group'
    | 'table-row'
    | 'table'

export type AlignItems =
    | 'baseline'
    | 'center'
    | 'end'
    | 'first baseline'
    | 'flex-end'
    | 'flex-start'
    | 'inherit'
    | 'initial'
    | 'last baseline'
    | 'normal'
    | 'revert'
    | 'safe center'
    | 'start'
    | 'stretch'
    | 'unsafe center'
    | 'unset'

export type JustifyContent =
    | 'center'
    | 'end'
    | 'flex-end'
    | 'flex-start'
    | 'inherit'
    | 'initial'
    | 'left'
    | 'normal'
    | 'revert'
    | 'right'
    | 'safe center'
    | 'space-around'
    | 'space-between'
    | 'space-evenly'
    | 'start'
    | 'stretch'
    | 'unsafe center'
    | 'unset'

export type TextAlign =
    | 'center'
    | 'end'
    | 'inherit'
    | 'initial'
    | 'justify-all'
    | 'justify'
    | 'left'
    | 'match-parent'
    | 'revert'
    | 'right'
    | 'start'
    | 'unset'

export type FlexDirection =
    | 'column-reverse'
    | 'column'
    | 'inherit'
    | 'initial'
    | 'revert'
    | 'row-reverse'
    | 'row'
    | 'unset'
