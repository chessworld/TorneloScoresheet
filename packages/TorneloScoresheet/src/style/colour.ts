/**
 * The colors we use in the app
 */

import { StatusBarStyle } from 'react-native';

export const colours = {
  negative: '#fa3e2d' as const,
  white: '#ffffff' as const,
  black: '#000000' as const,
  // Brand Colours
  primary: '#00aeef' as const,
  primary20: 'rgba(0, 174, 239, 0.2)' as const,
  secondary: '#1a2136' as const,
  secondary40: 'rgba(26, 33, 54, 0.4)' as const,
  tertiary: '#ffbf00' as const,
  // Elements Colours
  darkenedElements: '#141414' as const,
};

export type ColourType = typeof colours[keyof typeof colours];

export const statusBarStyleForColor = (colour: ColourType): StatusBarStyle => {
  switch (colour) {
    case colours.primary:
    case colours.secondary:
    case colours.negative:
    case colours.darkenedElements:
    case colours.black:
      return 'light-content';
    case colours.primary20:
    case colours.secondary40:
    case colours.tertiary:
    case colours.white:
      return 'dark-content';
  }
};

/**
 * Given a background colour, return an appropriate colour to render
 * text on top of that background
 *
 * @param colour The background colour
 * @returns a colour string
 */
export const textColour = (colour: ColourType): string => {
  switch (colour) {
    case colours.primary:
    case colours.secondary:
    case colours.negative:
    case colours.darkenedElements:
    case colours.black:
      return 'white';
    case colours.primary20:
    case colours.secondary40:
    case colours.tertiary:
    case colours.white:
      return 'black';
  }
};
