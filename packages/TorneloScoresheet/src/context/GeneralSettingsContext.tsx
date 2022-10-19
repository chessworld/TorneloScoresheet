import React, { useContext, useEffect, useState } from 'react';
import {
  defaulGeneralSettings,
  GeneralSettings,
} from '../types/GeneralSettingsState';
import {
  getStoredGeneralSettings,
  storeGeneralSettings,
} from '../util/storage';

const GeneralSettingsContext = React.createContext<
  [GeneralSettings, React.Dispatch<React.SetStateAction<GeneralSettings>>]
>([defaulGeneralSettings, () => undefined]);

export const useGeneralSettings = (): [
  GeneralSettings,
  (settings: GeneralSettings) => Promise<void>,
] => {
  const [generalSettingsContext, setGeneralSettingsContext] = useContext(
    GeneralSettingsContext,
  );

  const setGeneralSettings = async (
    settings: GeneralSettings,
  ): Promise<void> => {
    setGeneralSettingsContext(settings);
    await storeGeneralSettings(settings);
  };

  return [generalSettingsContext, setGeneralSettings];
};

export const GeneralSettingsContextProvider: React.FC = ({ children }) => {
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(
    defaulGeneralSettings,
  );

  useEffect(() => {
    getStoredGeneralSettings().then(settings => {
      if (settings) {
        setGeneralSettings(settings);
      }
    });
  }, []);
  return (
    <GeneralSettingsContext.Provider
      value={[generalSettings, setGeneralSettings]}>
      {children}
    </GeneralSettingsContext.Provider>
  );
};
