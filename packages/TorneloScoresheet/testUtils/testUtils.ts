import { renderHook, RenderResult } from '@testing-library/react-hooks';
import moment from 'moment';
import React from 'react';
import { chessEngine } from '../src/chessEngine/chessEngineInterface';
import { AppModeStateContextProvider } from '../src/context/AppModeStateContext';
import {
  AppMode,
  AppModeState,
  GraphicalRecordingMode,
} from '../src/types/AppModeState';
import { ChessGameInfo, PlayerColour } from '../src/types/ChessGameInfo';
import { ChessPly } from '../src/types/ChessMove';

/**
 * Mocks a hook for testing
 * @param hook the hook function to mock
 * @returns the rendered hook result
 */
export const renderCustomHook = <T>(hook: () => T): RenderResult<T> => {
  const { result: state } = renderHook(() => hook(), {
    wrapper: AppModeStateContextProvider,
  });
  return state;
};

/**
 * Generates a fake pairing
 * @returns a ChessGameInfo object with test values
 */
export const generateGamePairingInfo = (pgn?: string): ChessGameInfo => {
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
  };
};

/**
 * Genrates a fake graphicalRecordingState object
 * @param moveHistory the move history to set in the state
 * @returns Graphical recording state object
 */
export const generateGraphicalRecordingState = (
  moveHistory: ChessPly[],
  pgn?: string,
): GraphicalRecordingMode => {
  return {
    startTime: 0,
    mode: AppMode.GraphicalRecording,
    pairing: generateGamePairingInfo(pgn),
    moveHistory: moveHistory,
    board: chessEngine.fenToBoardPositions(
      moveHistory.at(-1)?.startingFen ?? chessEngine.startingFen(),
    ),
    currentPlayer: PlayerColour.White,
  };
};

/**
 * Mocks the appmodeContext
 * useContext(appmodecontext) will return the fake state passed as and argument
 * and a mock function to set the context which is returned from this function
 * @param state The state to be returned when calling useContext
 * @returns the setContext mocked function
 */
export const mockAppModeContext = (
  state: AppModeState,
): jest.Mock<React.Dispatch<React.SetStateAction<AppModeState>>> => {
  const setContextMock = jest.fn();
  const useContextSpy = jest.spyOn(React, 'useContext');
  useContextSpy.mockImplementation(_ => [state, setContextMock]);
  return setContextMock;
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
