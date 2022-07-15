import { BoardPosition } from './ChessBoardPositions';
import { ChessGameInfo, ChessGameResult, PlayerColour } from './ChessGameInfo';
import { ChessPly } from './ChessMove';

export enum AppMode {
  EnterPgn,
  PariringSelection,
  TablePairing,
  GraphicalRecording,
  ResultDisplay,
  ArbiterGame,
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
  moveHistory: ChessPly[];
  board: BoardPosition[];
  currentPlayer: PlayerColour;
};

export type ResultDisplayMode = {
  mode: AppMode.ResultDisplay;
  pairing: ChessGameInfo;
  result: ChessGameResult;
};

export type ArbiterGameMode = {
  mode: AppMode.ArbiterGame;
};

export type AppModeState =
  | EnterPgnMode
  | PairingSelectionMode
  | TablePairingMode
  | GraphicalRecordingMode
  | ResultDisplayMode
  | ArbiterGameMode;
