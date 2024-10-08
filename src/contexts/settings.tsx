import { createContext, useContext } from 'react'

import type { FC } from 'react'

import type { RawDesignTokens } from '../utils/styles/designTokens'

type SettingsProps = {
    designTokens?: RawDesignTokens
}

type SettingsProviderProps = {
    children: JSX.Element
    settings: SettingsProps
}

const SettingsContext = createContext<SettingsProps>({})

const SettingsProvider: FC<SettingsProviderProps> = ({ children, settings }) => (
    <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>
)

export default SettingsProvider

export const useSettings = (): SettingsProps => useContext(SettingsContext)
