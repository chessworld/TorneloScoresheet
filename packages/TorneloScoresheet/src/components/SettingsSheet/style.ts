import { StyleSheet } from 'react-native';
import { primary } from '../../style/font';
import { FontWeight } from '../PrimaryText/PrimaryText';

export const styles = StyleSheet.create({
  informationAndInputBoxContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 30,
  },
  dropDownContainer: {
    width: 350,
    marginLeft: 30,
  },
  settingText: {
    fontSize: 25,
    fontFamily: primary,
    fontWeight: FontWeight.SemiBold,
    minWidth: 220,
    zIndex: 10,
  },
  buttonText: {
    fontSize: 25,
  },
  saveButton: {
    minWidth: 200,
    height: 70,
    marginTop: 50,
  },
  dropDownLabel: {
    zIndex: 10,
  },
  inputBoxesContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 29,
    alignContent: 'center',
    alignItems: 'center',
    width: 600,
  },
});
