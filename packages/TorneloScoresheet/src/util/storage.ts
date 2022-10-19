import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArbiterInfo } from '../types/ArbiterInfoState';
import { ChessGameInfo } from '../types/ChessGameInfo';
import { PlayerColour } from '../types/ChessGameInfo';
import { ChessPly } from '../types/ChessMove';
import { GeneralSettings } from '../types/GeneralSettingsState';
import { maxPastGameStored } from './env';

/**
 * Builds a setter and getter functions for storing strings
 * @param key The string key used to uniquely identify this data
 * @returns [getFunction, setFunction]
 */
const buildStoreGetFuncs = (
  key: string,
): [(data: string) => Promise<void>, () => Promise<string | null>] => {
  // storage function
  const storeFunc = async (data: string): Promise<void> => {
    return AsyncStorage.setItem(key, data);
  };

  // getting function
  const getFunc = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(key);
  };

  return [storeFunc, getFunc];
};

/**
 * Builds a setter and getter functions for storage data
 * Data will be converted to JSON string for storage and parsed when accessing
 * @param key The string key used to uniquely identify this data
 * @type T The type of the data being stored
 * @returns [getFunction, setFunction]
 */
const buildJsonStoreGetFuncs = <T>(
  key: string,
): [(data: T) => Promise<void>, () => Promise<T | null>] => {
  // storage function
  const storeFunc = async (data: T): Promise<void> => {
    return AsyncStorage.setItem(key, JSON.stringify(data));
  };

  // getting function
  const getFunc = async (): Promise<T | null> => {
    const dataJson = await AsyncStorage.getItem(key);

    if (dataJson) {
      try {
        const data: T = JSON.parse(dataJson);
        return data;
      } catch {
        return null;
      }
    } else {
      return null;
    }
  };

  return [storeFunc, getFunc];
};

/**
 * Builds a setter and getter functions for storing data that has different
 * data between storing and saving
 * Data will be converted to JSON string for storage and parsed when accessing
 * @param key The string key used to uniquely identify this data
 * @param mappingFunc The function that maps the previously stored data and the new data to the new storage data
 * @type T The type of the data being stored
 * @returns [getFunction, setFunction]
 */
const buildComplexStoreGetFuncs = <T, R>(
  key: string,
  mappingFunc: (newData: T, prevData: R | null) => R,
): [(data: T) => Promise<void>, () => Promise<R | null>] => {
  // getting function
  const getFunc = async (): Promise<R | null> => {
    const dataJson = await AsyncStorage.getItem(key);
    if (dataJson) {
      try {
        const data: R = JSON.parse(dataJson);
        return data;
      } catch {
        return null;
      }
    } else {
      return null;
    }
  };

  // setting function
  const setFunc = async (data: T): Promise<void> => {
    const prevData = await getFunc();
    const newData = mappingFunc(data, prevData);

    return AsyncStorage.setItem(key, JSON.stringify(newData));
  };

  return [setFunc, getFunc];
};

// Recording mode data -> stores start time, moveHistory and current player
// used whenever exiting recording mode to be able to go back
const RECORDING_MODE_DATA = 'RECORDING_MODE_DATA';
export type StoredRecordingModeData = {
  startTime: number;
  moveHistory: ChessPly[];
  currentPlayer: PlayerColour;
};
export const [storeRecordingModeData, getStoredRecordingModeData] =
  buildJsonStoreGetFuncs<StoredRecordingModeData>(RECORDING_MODE_DATA);

// Pairing list, stores all the parings
// used to go back to pairing selection in arbiter mode
const PAIRING_LIST = 'PARING_LIST';
export const [storePairingList, getStoredPairingList] =
  buildJsonStoreGetFuncs<ChessGameInfo[]>(PAIRING_LIST);

// PGN url, stores the url
// used to be able to access the prev used url when eneting the url
const ARBITER_INFO = 'ARBITER_INFO';
export const [storeArbiterInfo, getStoredArbiterInfo] =
  buildJsonStoreGetFuncs<ArbiterInfo>(ARBITER_INFO);

// Game history data, stores the signatures and pgns of past games
// Required for arbiter to see previous games to settle disputes
const GAME_HISTORY_DATA = 'GAME_HISTORY_DATA';
export type StoredGameHistory = {
  pairing: ChessGameInfo;
  pgn: string;
  whiteSign: string;
  blackSign: string;
  winner: PlayerColour | null;
};

const mapNewHistoryToHistoryArray = (
  gameHistory: StoredGameHistory,
  prevHistory: StoredGameHistory[] | null,
): StoredGameHistory[] => {
  // no hisotry saved -> save array with 1 item
  if (!prevHistory) {
    return [gameHistory];
  }

  // maximum storage not reached -> append new history and save
  if (prevHistory.length < maxPastGameStored) {
    return [...prevHistory, gameHistory];
  }

  // maximum storage reached -> replace oldest game with new one
  return [...prevHistory.slice(1), gameHistory];
};
export const [storeGameHistory, getStoredGameHistory] =
  buildComplexStoreGetFuncs<StoredGameHistory, StoredGameHistory[]>(
    GAME_HISTORY_DATA,
    mapNewHistoryToHistoryArray,
  );

// stores the general settings to they are saved after quitting
const GENERAL_SETTINGS = 'GENERAL_SETTINGS';
export const [storeGeneralSettings, getStoredGeneralSettings] =
  buildJsonStoreGetFuncs<GeneralSettings>(GENERAL_SETTINGS);
