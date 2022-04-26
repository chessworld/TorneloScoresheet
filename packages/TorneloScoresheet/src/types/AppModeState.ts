import { GameInfo } from './chessGameInfo';

export enum AppMode {
  ArbiterSetup,
  TablePairing,
  PlayerScoresheetRecording,
  ResultDisplay,
}

export enum ArbiterModeViews {
  EnterPgnLink,
  TablePairingSelection
}
export type ArbiterSetupMode = {
  mode: AppMode.ArbiterSetup;
  view: ArbiterModeViews
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
  | ArbiterSetupMode
  | TablePairingMode
  | PlayerScoresheetRecordingMode;
