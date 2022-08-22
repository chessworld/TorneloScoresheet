import { Dimensions } from 'react-native';
import { TOOLBAR_HEIGHT } from '../components/Toolbar/constants';

const { height, width } = Dimensions.get('screen');

export const pageHeight = height - TOOLBAR_HEIGHT;
export const pageWidth = width;
