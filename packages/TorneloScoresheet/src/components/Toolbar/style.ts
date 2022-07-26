import { StyleSheet } from 'react-native';
const TOP_PADDING = 30;
const BOTTOM_PADDING = 14;
const LOGO_HEIGHT = 44;

export const TOOLBAR_HEIGHT = TOP_PADDING + LOGO_HEIGHT + BOTTOM_PADDING;

export const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingBottom: BOTTOM_PADDING,
    paddingRight: 20,
    paddingTop: TOP_PADDING,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: TOOLBAR_HEIGHT,
  },
  logo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: 10,
    marginRight: -10,
  },
  logoTitle: { lineHeight: LOGO_HEIGHT },
  helpText: { marginBottom: 10 },
});
