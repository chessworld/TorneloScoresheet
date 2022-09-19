import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import fs from 'react-native-fs';
import Markdown from 'react-native-markdown-package';
import { useAppModeState } from '../../context/AppModeStateContext';
import { AppMode, AppModeState } from '../../types/AppModeState';
import PrimaryButton from '../PrimaryButton/PrimaryButton';

const getHelp = async (fileName: string): Promise<string> => {
  const path =
    (fs.MainBundlePath ?? fs.DocumentDirectoryPath) +
    `/documentation/${fileName}`;
  return fs.readFile(path, 'utf8');
};

const styles = StyleSheet.create({
  container: { height: 400 },
  buttonLabel: { fontSize: 20 },
  button: { marginTop: 20 },
});

const markdownStyle = StyleSheet.create({
  listItemBullet: {
    fontSize: 30,
    lineHeight: 30,
  },
  listItemText: {
    fontSize: 20,
  },
  text: { fontSize: 20 },
  paragraph: { marginTop: 10, marginBottom: 10 },
  list: { marginBottom: 20 },
});

const helpFile = (state: AppModeState): string => {
  switch (state.mode) {
    case AppMode.ArbiterRecording:
      return 'ArbiterRecording.md';
    case AppMode.ArbiterResultDisplay:
      return 'ArbiterResultDisplay.md';
    case AppMode.ArbiterTablePairing:
      return 'ArbiterTablePairing.md';
    case AppMode.EditMove:
      return 'EditMove.md';
    case AppMode.EnterPgn:
      return 'EnterPgn.md';
    case AppMode.PairingSelection:
      return 'PairingSelection.md';
    case AppMode.Recording:
      return 'Recording.md';
    case AppMode.ResultDisplay:
      return 'ResultsDisplay.md';
    case AppMode.TablePairing:
      return 'TablePairing.md';
    case AppMode.ViewPastGames:
      return 'ViewPastGames.md';
  }
};

export type HelpProps = {
  onDone: () => void;
};

const Help = ({ onDone }: HelpProps) => {
  const appModeState = useAppModeState();
  const [markdown, setMarkdown] = useState<string | undefined>(undefined);

  useEffect(() => {
    getHelp(helpFile(appModeState)).then(res => setMarkdown(res));
  }, [appModeState]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Markdown styles={markdownStyle}>{markdown ?? ''}</Markdown>
      </ScrollView>
      <PrimaryButton
        label="Done"
        labelStyle={styles.buttonLabel}
        onPress={onDone}
        style={styles.button}
      />
    </View>
  );
};

export default Help;
