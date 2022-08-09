import { BoardPosition } from './ChessBoardPositions';
import { ChessGameInfo, ChessGameResult, PlayerColour } from './ChessGameInfo';
import { ChessPly } from './ChessMove';

export enum AppMode {
  EnterPgn,
  PairingSelection,
  TablePairing,
  Recording,
  ResultDisplay,
  ArbiterRecording,
  ArbiterTablePairing,
  ArbiterResultDisplay,
}

export const isArbiterMode = (mode: AppMode): boolean =>
  ({
    [AppMode.EnterPgn]: true,
    [AppMode.PairingSelection]: true,
    [AppMode.TablePairing]: false,
    [AppMode.Recording]: false,
    [AppMode.ResultDisplay]: false,
    [AppMode.ArbiterRecording]: true,
    [AppMode.ArbiterTablePairing]: true,
    [AppMode.ArbiterResultDisplay]: true,
  }[mode]);

export const isArbiterFromPlayerMode = (mode: AppMode): boolean =>
  ({
    [AppMode.EnterPgn]: false,
    [AppMode.PairingSelection]: false,
    [AppMode.TablePairing]: false,
    [AppMode.Recording]: false,
    [AppMode.ResultDisplay]: false,
    [AppMode.ArbiterRecording]: true,
    [AppMode.ArbiterTablePairing]: true,
    [AppMode.ArbiterResultDisplay]: true,
  }[mode]);

export type EnterPgnMode = {
  mode: AppMode.EnterPgn;
};
export type PairingSelectionMode = {
  mode: AppMode.PairingSelection;
  games?: number;
  pairings?: ChessGameInfo[];
};

export type TablePairingMode = {
  mode: AppMode.TablePairing;
  pairing: ChessGameInfo;
};

export type RecordingMode = {
  mode: AppMode.Recording;
  startTime: number;
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

export type ArbiterRecordingMode = {
  mode: AppMode.ArbiterRecording;
} & Omit<RecordingMode, 'mode'>;

export type ArbiterTablePairingMode = {
  mode: AppMode.ArbiterTablePairing;
  pairing: ChessGameInfo;
};

export type ArbiterResultDisplayMode = {
  mode: AppMode.ArbiterResultDisplay;
  pairing: ChessGameInfo;
  result: ChessGameResult;
};

export type AppModeState =
  | EnterPgnMode
  | PairingSelectionMode
  | TablePairingMode
  | RecordingMode
  | ResultDisplayMode
  | ArbiterRecordingMode
  | ArbiterResultDisplayMode
  | ArbiterTablePairingMode;
