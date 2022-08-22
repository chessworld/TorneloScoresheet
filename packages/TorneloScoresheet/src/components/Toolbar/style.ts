import { StyleSheet } from 'react-native';
import { pageWidth } from '../../util/pageSize';
import {
  BOTTOM_PADDING,
  TOP_PADDING,
  TOOLBAR_HEIGHT,
  LOGO_HEIGHT,
} from './constants';

export const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingBottom: BOTTOM_PADDING,
    paddingRight: 20,
    paddingTop: TOP_PADDING,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: TOOLBAR_HEIGHT,
  },
  logo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    left: 0.5 * pageWidth - 100,
    bottom: 18,
  },
  logoImage: {
    width: 40,
    height: LOGO_HEIGHT,
    marginRight: 24,
    marginLeft: -24,
  },
  placeHolderButton: {
    height: 40,
    width: 40,
  },
  enterPinText: { marginTop: 40, marginLeft: 100 },
  arbiterModeButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoTitle: { lineHeight: LOGO_HEIGHT },
  helpText: { marginBottom: 10 },
  toggleToTextEntryModeButton: {
    marginRight: 20,
  },
  arbiterLock: {
    flex: 1,
  },
  versionContainer: { marginLeft: 6, marginTop: 6 },
});
