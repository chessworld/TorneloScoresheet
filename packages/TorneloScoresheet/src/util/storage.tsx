import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChessGameInfo } from '../types/ChessGameInfo';

const PGN_API_URL = 'PGN_API_URL';
const PAIRING_LIST = 'PARING_LIST';

export const storePgnUrl = async (pgnApiURl: string): Promise<void> => {
  await AsyncStorage.setItem(PGN_API_URL, pgnApiURl);
};

export const getStoredPgnUrl = async (): Promise<string | null> => {
  const pgnUrl = await AsyncStorage.getItem(PGN_API_URL);
  return pgnUrl;
};

/**
 * Stores the pairing List to local storage
 * @param pairingList The pairing List to store
 */
export const storePairingList = async (
  pairingList: ChessGameInfo[],
): Promise<void> => {
  await AsyncStorage.setItem(PAIRING_LIST, JSON.stringify(pairingList));
};

/**
 * Retrieve the stored pairing list
 * @returns The pairing list if found else null
 */
export const getStoredPairingList = async (): Promise<
  ChessGameInfo[] | null
> => {
  const pairingListJson = await AsyncStorage.getItem(PAIRING_LIST);
  // if found, try parse and cast to ChessGameInfo[] else return null
  if (!pairingListJson) {
    return null;
  }

  try {
    const pairingList: ChessGameInfo[] = JSON.parse(pairingListJson);
    return pairingList;
  } catch {
    return null;
  }
};
