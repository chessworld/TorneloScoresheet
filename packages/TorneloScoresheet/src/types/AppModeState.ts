import { ChessGameInfo } from './ChessGameInfo';

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
  pairings?: ChessGameInfo[];
};

export type TablePairingMode = {
  mode: AppMode.TablePairing;
  pairing: ChessGameInfo;
};

export type PlayerScoresheetRecordingMode = {
  mode: AppMode.PlayerScoresheetRecording;
  scores?: number[]; //what's this?
  pairing: ChessGameInfo;
  playerNumber: number;
};

export type AppModeState =
  | EnterPgnMode
  | PairingSelectionMode
  | TablePairingMode
  | PlayerScoresheetRecordingMode;
