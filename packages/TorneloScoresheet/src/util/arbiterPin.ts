/**
 * Given a pin string, return True if the pin is valid
 */
export const pinValid = (inputPin: string): boolean => {
  const arbiterPin = '1234'; //TODO: change to global variable set by user.
  return inputPin == arbiterPin ? true : false;
};
