/**
 * @format
 */

import 'react-native';
import React, { useState } from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer, { act } from 'react-test-renderer';
import ArbiterSetup from '../src/pages/ArbiterSetup';
import {
  AppModeStateContextProvider,
  useAppModeState,
} from '../src/context/AppModeStateContext';
import { AppMode } from '../src/types/AppModeState';
import { Button } from 'react-native';

it('renders correctly', () => {
  renderer.create(<App />);
});

test('Default AppModeState is ArbiterSetup', () => {
  const testRenderer = renderer.create(<App />);
  expect(
    testRenderer.root?.findAllByType(ArbiterSetup, { deep: true }).length,
  ).toBe(1);
});

test('Initial `useAppModeState` value is ArbiterSetup', () => {
  const TestComponent: React.FC = () => {
    const [modeState] = useAppModeState();
    expect(modeState).toStrictEqual({ mode: AppMode.ArbiterSetup });
    return <></>;
  };
  renderer.create(
    <AppModeStateContextProvider>
      <TestComponent />
    </AppModeStateContextProvider>,
  );
});

test('enterTablePairingMode', () => {
  const TestComponent: React.FC = () => {
    const [modeState, { enterTablePairingMode }] = useAppModeState();

    // We maintain some state to check if we have called `enterTablePairingMode` yet
    const [calledEnterTablePairingMode, setCalledEnterTablePairingMode] =
      useState(false);

    // If we have called it, we should be in ArbiterSetup mode, else we should be in table paring mode
    if (!calledEnterTablePairingMode) {
      expect(modeState).toStrictEqual({ mode: AppMode.ArbiterSetup });
    } else {
      expect(modeState).toStrictEqual({ mode: AppMode.TablePairing, games: 0 });
    }

    const nextState = () => {
      setCalledEnterTablePairingMode(true);
      enterTablePairingMode('');
    };
    return <Button title="" onPress={nextState} />;
  };

  const instance = renderer.create(
    <AppModeStateContextProvider>
      <TestComponent />
    </AppModeStateContextProvider>,
  );
  expect(instance.root.findAllByType(Button).length).toBe(1);
  act(() => instance.root.findAllByType(Button)[0].props.onPress());
});
