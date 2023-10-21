import { createContext, useState } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    agentModel: '',
    systemPrompt: '',
    chatConstants: '',
    useProfileData: false,
    chatName: '',
    id: '',
  });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};