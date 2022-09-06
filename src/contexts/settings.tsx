import React, { createContext, FC, useContext } from 'react'
import { DesignTokens } from '../utils/styles/designTokens'

type SettingsProps = {
    designTokens?: DesignTokens
}

type SettingsProviderProps = {
    children: JSX.Element
} & SettingsProps

const SettingsContext = createContext<SettingsProps>({})

const SettingsProvider: FC<SettingsProviderProps> = ({
    designTokens,
    children
}) => (
    <SettingsContext.Provider value={{ designTokens }}>
        {children}
    </SettingsContext.Provider>
)

export default SettingsProvider

export const useSettings = (): SettingsProps => useContext(SettingsContext)
