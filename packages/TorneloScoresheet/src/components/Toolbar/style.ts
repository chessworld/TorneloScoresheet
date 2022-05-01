import { primary as primaryFont } from '../../style/font';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingBottom: 20,
    paddingRight: 20,
    paddingTop: 34,
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
    height: 44,
    marginRight: 24,
  },
  logoText: {
    fontSize: 34,
    fontFamily: primaryFont,
    fontWeight: '700',
  },
});
