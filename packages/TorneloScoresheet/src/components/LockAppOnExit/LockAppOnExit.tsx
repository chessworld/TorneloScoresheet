import React, { useEffect, useRef, useState } from 'react';
import { AppState, View } from 'react-native';
import { useCurrentAppMode } from '../../context/AppModeStateContext';
import { AppMode, isArbiterMode } from '../../types/AppModeState';
import Pin from '../Pin/Pin';
import Sheet from '../Sheet/Sheet';

type LockAppOnExitProps = {
  children: React.ReactNode;
};

const LockAppOnExit = ({ children }: LockAppOnExitProps) => {
  const appState = useRef(AppState.currentState);
  const currentAppMode = useCurrentAppMode();
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        nextAppState.match(/inactive|background/) &&
        appState.current === 'active' &&
        !isArbiterMode(currentAppMode) &&
        currentAppMode !== AppMode.ResultDisplay
      ) {
        setLocked(true);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [currentAppMode]);

  return (
    <View>
      <Sheet visible={locked} title="App locked - call arbiter">
        <Pin
          onPress={() => setLocked(false)}
          buttonText="Return to Game mode"
        />
      </Sheet>
      {children}
    </View>
  );
};

export default LockAppOnExit;
