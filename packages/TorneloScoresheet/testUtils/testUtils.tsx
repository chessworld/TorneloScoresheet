import { renderHook, RenderResult } from '@testing-library/react-hooks';
import moment from 'moment';
import React from 'react';
import { chessEngine } from '../src/chessEngine/chessEngineInterface';
import { AppModeStateContextProvider } from '../src/context/AppModeStateContext';
import {
  AppMode,
  AppModeState,
  RecordingMode,
} from '../src/types/AppModeState';
import { ChessGameInfo, PlayerColour } from '../src/types/ChessGameInfo';
import { ChessPly } from '../src/types/ChessMove';
import { getShortFenAfterMove } from '../src/util/moves';
import * as Storage from '../src/util/storage';

/**
 * Uses react testing library to do a headlesss render of a hook for testing
 * @param hook the hook function to test
 * @returns the rendered hook result
 */
export const renderCustomHook = <T extends any>(
  hook: () => T,
  initialState: AppModeState,
): RenderResult<T> => {
  const wrapper: React.FC = ({ children }) => (
    <AppModeStateContextProvider initialState={initialState}>
      {children}
    </AppModeStateContextProvider>
  );

  const { result: state } = renderHook(() => hook(), {
    wrapper,
  });
  return state;
};

/**
 * Generates a fake pairing
 * @returns a ChessGameInfo object with test values
 */
export const generateGamePairingInfo = (
  pgn?: string,
  positionOccurances?: Record<string, number>,
): ChessGameInfo => {
  return {
    name: 'name',
    site: 'site',
    date: moment(),
    board: 1,
    players: [
      {
        teamName: undefined,
        firstName: 'name',
        lastName: 'name',
        elo: 0,
        country: 'au',
        color: PlayerColour.White,
        fideId: 0,
      },
      {
        teamName: undefined,
        firstName: 'name',
        lastName: 'name',
        elo: 0,
        country: 'au',
        color: PlayerColour.Black,
        fideId: 0,
      },
    ],
    result: '',
    pgn: pgn ?? '',
    positionOccurances: positionOccurances ?? {},
  };
};

export const buildMoveOccurrencesForMoveHistory = (
  moveHistory: ChessPly[],
): Record<string, number> =>
  moveHistory.reduce((acc, el) => {
    const key = getShortFenAfterMove(el);
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key] += 1;
    return acc;
  }, {} as Record<string, number>);

/**
 * Genrates a fake RecordingState object
 * @param moveHistory the move history to set in the state
 * @returns recording state object
 */
export const generateRecordingState = (
  moveHistory: ChessPly[],
  recordingModeType: 'Graphical' | 'Text',
  pgn?: string,
): RecordingMode => {
  return {
    startTime: new Date().getTime(),
    mode: AppMode.Recording,
    pairing: generateGamePairingInfo(
      pgn,
      buildMoveOccurrencesForMoveHistory(moveHistory),
    ),
    moveHistory: moveHistory,
    board: chessEngine.fenToBoardPositions(
      moveHistory.at(-1)?.startingFen ?? chessEngine.startingFen(),
    ),
    currentPlayer: PlayerColour.White,
    type: recordingModeType,
  };
};

/**
 * mocks the getStoredRecordingModeData of storage
 * @param startTime the start time
 * @param moveHistory the move history array
 * @param currentPlayer the current player
 */
export const mockGetRecordingModeData = (
  startTime?: number,
  moveHistory?: ChessPly[],
  currentPlayer?: PlayerColour,
) => {
  const getRecordingStorageSpy = jest.spyOn(
    Storage,
    'getStoredRecordingModeData',
  );
  const data: Storage.StoredRecordingModeData = {
    startTime: startTime ?? 0,
    moveHistory: moveHistory ?? [],
    currentPlayer: currentPlayer ?? PlayerColour.White,
  };
  getRecordingStorageSpy.mockImplementation(
    (): Promise<Storage.StoredRecordingModeData> => Promise.resolve(data),
  );
};

/**
 * Replaces the headers for a pgn with a score
 * @param pgn the pgn
 * @param result the result string
 * @returns the new pgn
 */
export const replaceResultHeaderFromPgn = (
  pgn: string,
  result: string,
): string => {
  let newPgn = pgn.replace('\n[Result "*"]', '');
  newPgn += `[Result "${result}"]`;
  return newPgn;
};

/**
 * Replaces the '*' Result from a pgn with a score and adds score to the headers
 * @param pgn the pgn
 * @param result the result string
 * @returns the new pgn
 */
export const stripStarAndReplaceResultFromPgn = (
  pgn: string,
  result: string,
): string => {
  return (
    replaceResultHeaderFromPgn(pgn.substring(0, pgn.length - 3), result) +
    '\n\n'
  );
};
