import { colours } from '../../style/colour';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
  },
  instructionSection: {
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 20,
  },
  instructionTitle: {
    fontWeight: 'bold',
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 30,
    fontSize: 40,
    color: colours.darkenedElements,
  },
  instructionContents: {
    color: colours.darkenedElements,
    fontSize: 30,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 20,
  },
  backBtn: {
    fontSize: 40,
    color: colours.secondary,
    padding: 30,
    fontWeight: 'bold',
  },
  forwardBtn: {
    fontSize: 40,
    color: colours.secondary,
    padding: 30,
    fontWeight: 'bold',
    flexGrow: 1,
    textAlign: 'right',
  },
  pairingList: {
    marginTop: 10,
    height: 500,
  },
  pairingCard: {
    height: 150,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  roundTextSection: {
    padding: 20,
  },
  roundText: {
    color: '#e9e9e9',
    fontSize: 80,
    fontWeight: 'bold',
  },
  nameTextInnerSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    flexGrow: 1,
    marginTop: 10,
  },
  nameText: {
    color: colours.white,
    fontSize: 30,
    margin: 10,
    marginRight: 20,
  },
});
