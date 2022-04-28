import { GameInfo } from './chessGameInfo';

export enum AppMode {
  EnterPgn,
  PariringSelection,
  TablePairing,
  PlayerScoresheetRecording,
  ResultDisplay,
}

export type EnterPgnMode = {
  mode: AppMode.EnterPgn;
};
export type PairingSelectionMode = {
  mode: AppMode.PariringSelection;
  games?: number;
  pairings?: GameInfo[];
};

export type TablePairingMode = {
  mode: AppMode.TablePairing;
};

export type PlayerScoresheetRecordingMode = {
  mode: AppMode.PlayerScoresheetRecording;
  table: number;
  scores: number[];
};

export type AppModeState =
  | EnterPgnMode
  | PairingSelectionMode
  | TablePairingMode
  | PlayerScoresheetRecordingMode;
