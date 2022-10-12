import { TORNELO_URL, MAX_PAST_GAME_STORED, EMAIL_API_ENDPOINT } from '@env';

export const torneloUrl = TORNELO_URL;
export const maxPastGameStored = MAX_PAST_GAME_STORED;
export const emailEndpoint = (arbiterId: string): string => {
  return EMAIL_API_ENDPOINT.replace('USER_ID', arbiterId);
};
