import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppModeState } from '../context/AppModeStateContext';
import { useError } from '../context/ErrorContext';
import { AppMode, ArbiterModeViews } from '../types/AppModeState';
import { isError } from '../types/Result';
import { validUrl } from '../util/url';
import EnterPgnLink from './EnterPgnLink';
import TablePairingSelection from './TablePairingSelection';

const ArbiterSetup: React.FC = () => {
  const [appModeState] = useAppModeState();
  if (appModeState.mode != AppMode.ArbiterSetup) {
    return <></>;
  }
  switch (appModeState.view) {
    case ArbiterModeViews.EnterPgnLink:
      return <EnterPgnLink />;
    case ArbiterModeViews.TablePairingSelection:
      return <TablePairingSelection />;
  }
};

export default ArbiterSetup;
