import { colours } from '../../style/colour';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  graphicalModePlayerCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    width: 340,
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: colours.grey5,
  },
  flag: {
    backgroundColor: 'yellow',
    width: 70,
    height: 40,
  },
  flexRow: { display: 'flex', flexDirection: 'row' },
  flexRowReverse: { display: 'flex', flexDirection: 'row-reverse' },
  flexColumn: { display: 'flex', flexDirection: 'column' },
  flexColumnReverse: { display: 'flex', flexDirection: 'column-reverse' },
  playerName: { maxWidth: 235 },
});
