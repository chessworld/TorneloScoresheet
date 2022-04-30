import AsyncStorage from '@react-native-async-storage/async-storage';

const PGN_API_URL = 'PGN_API_URL';

export const storePgnUrl = async (pgnApiURl: string): Promise<void> => {
  await AsyncStorage.setItem(PGN_API_URL, pgnApiURl);
};

export const getStoredPgnUrl = async (): Promise<string | null> => {
  const pgnUrl = await AsyncStorage.getItem(PGN_API_URL);
  return pgnUrl;
};
