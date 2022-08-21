import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  moveSelector: {
    marginHorizontal: '10%',
    marginTop: 10,
  },
  backButtonAndMessageContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  message: {},
  backButton: {
    borderRadius: 0,
  },
  optionButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
