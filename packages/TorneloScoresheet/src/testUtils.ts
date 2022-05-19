import { renderHook, RenderResult } from '@testing-library/react-hooks';
import moment from 'moment';
import React from 'react';
import { chessEngine } from './chessEngine/chessEngineInterface';
import { AppModeStateContextProvider } from './context/AppModeStateContext';
import {
  AppMode,
  AppModeState,
  GraphicalRecordingMode,
} from './types/AppModeState';
import { ChessGameInfo, PlayerColour } from './types/ChessGameInfo';
import { ChessMove } from './types/ChessMove';

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
export const generateGamePairingInfo = (): ChessGameInfo => {
  return {
    name: 'name',
    site: 'site',
    date: moment(),
    board: 1,
    players: [
      {
        firstName: 'name',
        lastName: 'name',
        elo: 0,
        country: 'au',
        color: PlayerColour.White,
        fideId: 0,
      },
      {
        firstName: 'name',
        lastName: 'name',
        elo: 0,
        country: 'au',
        color: PlayerColour.Black,
        fideId: 0,
      },
    ],
    result: '',
    pgn: '',
  };
};

/**
 * Genrates a fake graphicalRecordingState object
 * @param moveHistory the move history to set in the state
 * @returns Graphical recording state object
 */
export const generateGraphicalRecordingState = (
  moveHistory: ChessMove[],
): GraphicalRecordingMode => {
  return {
    mode: AppMode.GraphicalRecording,
    pairing: generateGamePairingInfo(),
    moveHistory: moveHistory,
    board: chessEngine.fenToBoardPositions(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
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
