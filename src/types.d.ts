export enum Breakpoint {
    mobilePortrait = 'mobilePortrait',
    mobileLandscape = 'mobileLandscape',
    tabletPortrait = 'tabletPortrait',
    tabletLandscape = 'tabletLandscape',
    desktopS = 'desktopS',
    desktopM = 'desktopM',
    desktopL = 'desktopL',
    desktopXL = 'desktopXL'
}

export type Breakpoints = {
    [key in keyof Breakpoint]: { [key: string]: string }
}

export type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5'

export type Color =
    | 'primary'
    | 'danger'
    | 'success'
    | 'info'
    | 'white'
    | 'black'

export type Spacing = 'tiny' | 'small' | 'medium' | 'default' | 'large' | 'huge'

export type FontSize = 'tiny' | 'small' | 'default' | 'medium' | 'large'

export type FontWeight = '300' | '600'

export type Display =
    | 'inline'
    | 'block'
    | 'contents'
    | 'flex'
    | 'grid'
    | 'inline-block'
    | 'inline-flex'
    | 'inline-grid'
    | 'inline-table'
    | 'list-item'
    | 'run-in'
    | 'table'
    | 'table-caption'
    | 'table-column-group'
    | 'table-header-group'
    | 'table-footer-group'
    | 'table-row-group'
    | 'table-cell'
    | 'table-column'
    | 'table-row'
    | 'none'
    | 'initial'
    | 'inherit'

export type AlignItems =
    | 'normal'
    | 'stretch'
    | 'center'
    | 'start'
    | 'end'
    | 'flex-start'
    | 'flex-end'
    | 'baseline'
    | 'first baseline'
    | 'last baseline'
    | 'safe center'
    | 'unsafe center'
    | 'inherit'
    | 'initial'
    | 'revert'
    | 'unset'

export type JustifyContent =
    | 'center'
    | 'start'
    | 'end'
    | 'flex-start'
    | 'flex-end'
    | 'left'
    | 'right'
    | 'normal'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch'
    | 'safe center'
    | 'unsafe center'
    | 'inherit'
    | 'initial'
    | 'revert'
    | 'unset'

export type TextAlign =
    | 'left'
    | 'right'
    | 'center'
    | 'justify'
    | 'justify-all'
    | 'start'
    | 'end'
    | 'match-parent'
    | 'inherit'
    | 'initial'
    | 'revert'
    | 'unset'

export type FlexDirection =
    | 'row'
    | 'row-reverse'
    | 'column'
    | 'column-reverse'
    | 'inherit'
    | 'initial'
    | 'revert'
    | 'unset'
