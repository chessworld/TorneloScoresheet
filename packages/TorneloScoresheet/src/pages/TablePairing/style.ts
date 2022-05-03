import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';

export const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
    fontSize: 70,
    color: colours.darkenedElements,
  },

  pairing: {
    height: 310,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 20,   
    backgroundColor: colours.primary20, 
  },

  roundTextSection: {
    padding: 20,
  },
  roundText: {
    textAlign: 'center',
    fontSize: 50,
    fontWeight: 'bold',
    color: colours.darkenedElements,
  },

  horizSeparator: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,

    marginTop: 40,
    marginBottom: 40,
    marginLeft: 70,
    marginRight: 70,
  },

  image: {
    width: 150,
    height: 155,
  },
});