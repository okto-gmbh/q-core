import React, { createContext, FC, useContext } from 'react'
import { DesignTokens } from '../utils/styles/designTokens'

type SettingsProps = {
    designTokens?: DesignTokens
}

type SettingsProviderProps = {
    children: JSX.Element
    settings: SettingsProps
}

const SettingsContext = createContext<SettingsProps>({})

const SettingsProvider: FC<SettingsProviderProps> = ({
    settings,
    children
}) => (
    <SettingsContext.Provider value={settings}>
        {children}
    </SettingsContext.Provider>
)

export default SettingsProvider

export const useSettings = (): SettingsProps => useContext(SettingsContext)
