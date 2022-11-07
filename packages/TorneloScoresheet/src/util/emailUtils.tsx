import axios, { AxiosResponse } from 'axios';
import { ArbiterInfo } from '../types/ArbiterInfoState';
import { ChessGameInfo } from '../types/ChessGameInfo';
import { fail, isError, Result, succ } from '../types/Result';
import { emailEndpoint } from './env';

export const emailGameResults = async (
  arbiterInfo: ArbiterInfo,
  pairing: ChessGameInfo,
  pgn: string,
): Promise<Result<string>> => {
  const sendRequest = (): Promise<AxiosResponse> => {
    const url = emailEndpoint(arbiterInfo.userId);
    const payload = {
      userId: arbiterInfo.userId,
      arbiterToken: arbiterInfo.arbiterToken,
      divisionId: arbiterInfo.divisionId,
      pgn,
      round: pairing.round,
      board: pairing.board,
      match: pairing.game,
    };
    const config = {
      validateStatus: () => true,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return axios.post(url, payload, config);
  };

  const resultOrErr: Result<AxiosResponse> = await (async () => {
    try {
      return succ(await sendRequest());
    } catch (e) {
      console.log(e);
      return fail('Network error, please check your internet connection');
    }
  })();
  if (isError(resultOrErr)) {
    return fail(resultOrErr.error);
  }

  if (resultOrErr.data.status !== 200) {
    console.log(resultOrErr.data.data);
    return fail(`Error sending email (${resultOrErr.data.status})`);
  }
  return succ('');
};
