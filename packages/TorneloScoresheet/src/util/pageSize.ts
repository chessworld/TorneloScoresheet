import { Dimensions } from 'react-native';
import { TOOLBAR_HEIGHT } from '../components/Toolbar/style';

const { height } = Dimensions.get('screen');

export const pageHeight = height - TOOLBAR_HEIGHT;
