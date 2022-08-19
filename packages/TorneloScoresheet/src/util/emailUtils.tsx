import qs from 'qs';
import { Linking } from 'react-native';
import { ChessGameInfo, ChessGameResult } from '../types/ChessGameInfo';
import { fail, succ } from '../types/Result';
import { chessGameIdentifier } from './chessGameInfo';
import { fullName } from './player';

export async function sendEmail(
  to: string,
  pairing: ChessGameInfo,
  result: ChessGameResult,
) {
  let url = `mailto:${to}`;
  const subjectLine =
    'Tornello Game Results ' +
    chessGameIdentifier(pairing) +
    ':' +
    fullName(pairing.players[0]) +
    ' vs' +
    fullName(pairing.players[1]);
  const body =
    'Tornello Game Results ' +
    chessGameIdentifier(pairing) +
    '\n\nPlayer 1: ' +
    fullName(pairing.players[0]) +
    '\nPlayer 2: ' +
    fullName(pairing.players[1]) +
    '\n\nFull Game PGN:\n' +
    result.gamePgn;

  // Create email link query
  const query = qs.stringify({
    subject: subjectLine,
    body: body,
    bcc: '', //option to add arbiter 'BCC' address in the future
  });

  if (query.length) {
    url += `?${query}`;
  }
  // check if we can use this link
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    return fail('Unable to send email');
  }

  Linking.openURL(url);

  return succ('');
}
