import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';

export const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colours.secondary40,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    backgroundColor: colours.white,
    margin: 200,
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 40,
    color: 'black',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 400,
  },
  title: {
    paddingLeft: 20,
    fontSize: 30,
    fontWeight: '700',
  },
  exitButton: {
    padding: 20,
  },
});
