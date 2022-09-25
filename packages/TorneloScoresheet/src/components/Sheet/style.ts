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
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 400,
    maxWidth: '90%',
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 4,
    shadowOpacity: 0.6,
  },
  content: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  titleContainer: {
    flexGrow: 10,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    padding: 20,
  },
  exitButtonContainer: {
    flexGrow: 1,
  },
  exitButton: {
    alignSelf: 'flex-end',
  },
});
