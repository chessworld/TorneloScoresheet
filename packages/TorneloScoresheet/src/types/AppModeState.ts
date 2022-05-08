import { ChessBoardPositions } from './ChessBoardPositions';
import { ChessGameInfo } from './ChessGameInfo';
import { ChessMove } from './ChessMove';

export enum AppMode {
  EnterPgn,
  PariringSelection,
  TablePairing,
  GraphicalRecording,
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

export type GraphicalRecordingMode = {
  mode: AppMode.GraphicalRecording;
  pairing: ChessGameInfo;
  moveHistory: ChessMove[];
  board: ChessBoardPositions;
};

export type AppModeState =
  | EnterPgnMode
  | PairingSelectionMode
  | TablePairingMode
  | GraphicalRecordingMode;
