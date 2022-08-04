import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { GameTime } from '../../types/ChessMove';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import Sheet from '../Sheet/Sheet';
import { styles } from './style';

export type TimePickerSheetProps = {
  gameTime: GameTime;
  visible: boolean;
  dismiss: () => void;
  setGameTime: (gameTime: GameTime | undefined) => void;
};

const TimePickerSheet: React.FC<TimePickerSheetProps> = ({
  gameTime,
  visible,
  dismiss,
  setGameTime,
}) => {
  // set day/month/year not important
  // date should be + 1 on hours for it to display properly,
  // this is taken into account when setting the date
  const [date, setDate] = useState(
    new Date(1, 1, 1, gameTime.hours, gameTime.minutes, 0),
  );

  // refresh game time whenever it changes
  useEffect(() => {
    setDate(new Date(1, 1, 1, gameTime.hours, gameTime.minutes, 0));
  }, [gameTime]);

  return (
    <Sheet dismiss={dismiss} visible={visible} title={'Set move time'}>
      <View style={styles.container}>
        <DatePicker
          style={styles.timeBox}
          date={date}
          onDateChange={setDate}
          mode={'time'}
          locale={'fr'}
          is24hourSource={'locale'}
        />
        <View style={styles.buttonContainer}>
          <PrimaryButton
            style={styles.buttons}
            label="remove"
            onPress={() => setGameTime(undefined)}
          />
          <PrimaryButton
            label="confirm"
            style={styles.buttons}
            onPress={() => {
              setGameTime({
                hours: date.getHours(),
                minutes: date.getMinutes(),
              });
            }}
          />
        </View>
      </View>
    </Sheet>
  );
};

export default TimePickerSheet;
