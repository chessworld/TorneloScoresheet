import { StyleSheet } from 'react-native';
import { pageHeight } from '../../util/pageSize';

export const styles = StyleSheet.create({
  container: {
    height: pageHeight,
  },
  title: {
    textAlign: 'center',
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 30,
    marginTop: 30,
  },
  primaryText: {
    textAlign: 'center',
  },
  horizontalSeparator: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginTop: 45,
    marginBottom: 35,
    marginLeft: 70,
    marginRight: 70,
  },
  emailButton: {
    width: 280,
    alignSelf: 'center',
    marginVertical: 30,
  },
});
