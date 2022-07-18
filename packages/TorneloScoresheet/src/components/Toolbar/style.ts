import { StyleSheet } from 'react-native';

const TOP_PADDING = 10;
const BOTTOM_PADDING = 10;
const LOGO_HEIGHT = 44;

export const TOOLBAR_HEIGHT = TOP_PADDING + BOTTOM_PADDING + LOGO_HEIGHT;

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
  },
  logo: {
    display: 'flex',
    flexDirection: 'row',
  },
  logoImage: {
    width: 40,
    height: LOGO_HEIGHT,
    marginRight: 24,
  },
});
