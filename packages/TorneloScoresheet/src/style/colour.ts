/**
 * The colors we use in the app
 */

import { StatusBarStyle } from 'react-native';

export const colours = {
  negative: '#fa3e2d' as const,
  white: '#ffffff' as const,
  black: '#000000' as const,
  lightGreen: 'rgba(5, 168, 111, 0.5)' as const,
  lightOrange: 'rgba(166, 101, 31, 0.5)' as const,
  // Brand Colours
  primary: '#00aeef' as const,
  primary20: 'rgba(0, 174, 239, 0.2)' as const,
  secondary: '#1a2136' as const,
  secondary40: 'rgba(26, 33, 54, 0.4)' as const,
  secondary70: 'rgba(26, 33, 54, 0.7)' as const,
  tertiary: '#ffbf00' as const,
  // Elements Colours
  darkenedElements: '#141414' as const,
  lightGrey: '#00000030' as const,
  grey: '#6B6A6E' as const,
  grey10: 'rgba(26, 33, 54, 0.1)' as const,
  darkGrey: '#323232' as const,
  // Chess Board Colours
  darkBlue: '#A2CEE3' as const,
  lightBlue: '#E3ECF3' as const,
};

export type ColourType = typeof colours[keyof typeof colours];

export const statusBarStyleForColor = (colour: ColourType): StatusBarStyle => {
  switch (colour) {
    case colours.primary:
    case colours.primary20:
    case colours.secondary:
    case colours.negative:
    case colours.darkenedElements:
    case colours.black:
    case colours.lightGrey:
    case colours.grey:
    case colours.grey10:
    case colours.darkGrey:
      return 'light-content';
    case colours.primary20:
    case colours.secondary40:
    case colours.secondary70:
    case colours.tertiary:
    case colours.white:
    case colours.lightBlue:
    case colours.lightOrange:
    case colours.lightGreen:
    case colours.darkBlue:
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
    case colours.lightBlue:
    case colours.darkBlue:
    case colours.lightGrey:
    case colours.grey:
    case colours.lightGreen:
    case colours.lightOrange:
    case colours.grey10:
    case colours.darkGrey:
      return 'white';
    case colours.secondary70:
    case colours.primary20:
    case colours.secondary40:
    case colours.tertiary:
    case colours.white:
    case colours.primary20:
      return 'black';
  }
};
