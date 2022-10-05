import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { colours, ColourType } from '../../style/colour';
import { ChessPly, GameTime } from '../../types/ChessMove';
import { moveString } from '../../util/moves';
import PrimaryText from '../PrimaryText/PrimaryText';
import { styles } from './style';
import Icon from 'react-native-vector-icons/Entypo';

export type MoveCellProps = {
  ply?: ChessPly;
  highlightColor?: ColourType;
  onCellSelect: (fen: string) => void;
};

const MoveCell: React.FC<MoveCellProps> = ({
  ply,
  highlightColor,
  onCellSelect,
}) => {
  const formatTime = (time?: GameTime): string => {
    if (!time) {
      return '--:--';
    }

    const padWith0 = (value: number): string => {
      return value > 9 ? value.toString() : `0${value}`;
    };
    return `${padWith0(time.hours)}:${padWith0(time.minutes)}`;
  };
  return (
    <View style={styles.moveCellContainer}>
      <TouchableOpacity
        onPress={() => {
          if (ply) {
            onCellSelect(ply.startingFen);
          }
        }}>
        <View
          style={[styles.moveSanTextBox, { backgroundColor: highlightColor }]}>
          {ply && <PrimaryText size={25} label={moveString(ply, false)} />}
        </View>
      </TouchableOpacity>
      <View style={styles.moveTimeTextBox}>
        {ply?.drawOffer && (
          <View style={styles.drawOfferIcon}>
            <Icon
              name="creative-commons-noderivs"
              size={16}
              color={colours.darkGrey}
            />
          </View>
        )}
        <PrimaryText label={formatTime(ply?.gameTime)} size={20} />
      </View>
    </View>
  );
};

export default MoveCell;
