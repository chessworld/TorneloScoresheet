import { GameInfo } from "./chessGameInfo";

export enum AppMode {
  ArbiterSetup,
  TablePairing,
  PlayerScoresheetRecording,
  ResultDisplay,
}

export type ArbiterSetupMode = {
  mode: AppMode.ArbiterSetup;
};

export type TablePairingMode = {
  mode: AppMode.TablePairing;
  games: number;
  pairings: GameInfo[]
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
