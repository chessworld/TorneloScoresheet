import { colours } from '../../style/colour';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  graphicalModePlayerCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '49%%',
    height: '100%',
    borderRadius: 10,
    padding: 10,
    backgroundColor: colours.grey20,
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
});
