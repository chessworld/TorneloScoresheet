import {
  REACT_APP_TORNELO_URL,
  REACT_APP_MAX_PAST_GAME_STORED,
  REACT_APP_EMAIL_API_ENDPOINT,
} from '@env';

export const torneloUrl = REACT_APP_TORNELO_URL;
export const maxPastGameStored = REACT_APP_MAX_PAST_GAME_STORED;
export const emailEndpoint = (arbiterId: string): string => {
  return REACT_APP_EMAIL_API_ENDPOINT.replace('USER_ID', arbiterId);
};
