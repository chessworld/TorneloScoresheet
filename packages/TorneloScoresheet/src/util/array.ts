/**
 * Givan array, return a new array with the last
 * element replaced with the given element
 *
 * (we don't modify the given array)
 */
export const replaceLastElement = <T>(arr: T[], newEl: T) =>
  arr.map((el, i) => (arr.length - 1 === i ? newEl : el));
