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
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    //flex: 1,
    height: TOOLBAR_HEIGHT,
  },
  logo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    // marginLeft: '5%',
    // marginRight: '5%',
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
    // marginLeft: 10,
    // marginRight: -10,
  },
  logoTitle: { lineHeight: LOGO_HEIGHT },
  helpText: { marginBottom: 10 },
  toggleToTextEntryModeButton: {
    marginRight: 20,
  },
  // buttonText: {
  //   fontSize: 23,
  //   fontWeight: 'bold',
  //   letterSpacing: 0.25,
  //   color: colours.primary,
  // },
  // textModeButton: {
  //   display: 'flex',
  //   flexDirection: 'column',
  //   alignItems: 'center',
  //   marginLeft: '-40%',
  //   marginRight: '-50%',
  // },
  // logoName: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   paddingEnd: '10%',
  // },
  // textButton: {
  //   marginLeft: '5%',
  //   marginRight: '5%',
  // },
});
