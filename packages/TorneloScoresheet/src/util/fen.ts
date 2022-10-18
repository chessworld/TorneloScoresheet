/**
 * Returns the board state section of a fen string
 * @param fen the current fen
 * @returns the state part of the fen or an empty string if the fen is invalid
 */
export const getStateFromFen = (fen: string): string => {
  const regexResult =
    /(?<boardState>.+\/.+\/.+\/.+\/.+\/.+\/.+\/.+?\s.{1})(?<game_state>\s.+?\s.+?\s.+?\s.+?)?/.exec(
      fen,
    );
  if (!regexResult || !regexResult.groups || !regexResult.groups.boardState) {
    return '';
  }
  return regexResult.groups.boardState;
};
