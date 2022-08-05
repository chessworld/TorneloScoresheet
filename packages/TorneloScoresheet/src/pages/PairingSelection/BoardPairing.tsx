import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import RoundedView from '../../components/RoundedView/RoundedView';
import { colours } from '../../style/colour';
import { ChessGameInfo } from '../../types/ChessGameInfo';
import { chessGameIdentifier } from '../../util/chessGameInfo';
import { styles } from './style';

type BoardPairingProps = {
  board: ChessGameInfo;
  selected: boolean;
} & TouchableOpacityProps;

const BoardPairing: React.FC<BoardPairingProps> = ({
  board,
  selected,
  ...touchableOpacityProps
}) => {
  const textColour = selected ? colours.white : colours.black;
  return (
    <TouchableOpacity {...touchableOpacityProps}>
      <RoundedView
        style={[styles.boardPairing, selected && styles.selectedBoardPairing]}>
        <View style={styles.boardPairingRow}>
          <PrimaryText
            weight={FontWeight.SemiBold}
            size={80}
            colour={textColour}>
            {chessGameIdentifier(board)}
          </PrimaryText>
          <View style={styles.nameColumn}>
            <PrimaryText
              numberOfLines={1}
              style={styles.playerName}
              colour={textColour}
              size={38}>
              {board.players?.[0].firstName} {board.players?.[0].lastName}
            </PrimaryText>
            <PrimaryText
              numberOfLines={1}
              style={styles.playerName}
              colour={textColour}
              size={38}>
              {board.players?.[1].firstName} {board.players?.[1].lastName}
            </PrimaryText>
          </View>
        </View>
      </RoundedView>
    </TouchableOpacity>
  );
};

export default BoardPairing;
