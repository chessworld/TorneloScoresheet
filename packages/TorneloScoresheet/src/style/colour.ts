/**
 * The colors we use in the app
 */

import { StatusBarStyle } from 'react-native';

export const colours = {
  negative: '#fa3e2d' as const,
  // Branc colours
  primary: '#00aeef' as const,
  secondary: '#1a2136' as const,
  tertiary: '#ffbf00' as const,
};

export type ColourType = typeof colours[keyof typeof colours];

export const statusBarStyleForColor = (colour: ColourType): StatusBarStyle => {
  switch (colour) {
    case colours.primary:
    case colours.secondary:
    case colours.negative:
      return 'light-content';
    case colours.tertiary:
      return 'dark-content';
  }
};

export const textColour = (colour: ColourType): string => {
  switch (colour) {
    case colours.primary:
    case colours.secondary:
    case colours.negative:
      return 'white';
    case colours.tertiary:
      return 'black';
  }
};
