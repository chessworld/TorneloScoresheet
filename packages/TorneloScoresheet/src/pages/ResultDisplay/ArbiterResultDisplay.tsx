import React from 'react';
import { View } from 'react-native';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import { useArbiterResultDisplayState } from '../../context/AppModeStateContext';
import { colours } from '../../style/colour';
import { chessGameIdentifier } from '../../util/chessGameInfo';
import { styles } from './style';

const ArbiterResultDisplay: React.FC = () => {
  const arbiterResultDisplayState = useArbiterResultDisplayState();
  const arbiterResultDisplayMode = arbiterResultDisplayState?.[0];

  const infoString = `Board ${
    arbiterResultDisplayMode?.pairing
      ? chessGameIdentifier(arbiterResultDisplayMode?.pairing)
      : '[Unknown Game]'
  }`;

  return (
    <>
      {arbiterResultDisplayMode && (
        <View style={styles.container}>
          <PrimaryText
            weight={FontWeight.Regular}
            size={70}
            style={styles.title}
            label={infoString}
            colour={colours.darkenedElements}
          />
          <View>
            <PlayerCard
              player={arbiterResultDisplayMode.pairing.players[0]}
              result={
                arbiterResultDisplayMode.result.winner === null
                  ? 0.5
                  : arbiterResultDisplayMode.pairing.players[0].color ===
                    arbiterResultDisplayMode.result.winner
                  ? 1
                  : 0
              }
            />
            <View style={styles.horizontalSeparator} />
            <PlayerCard
              player={arbiterResultDisplayMode.pairing.players[1]}
              result={
                arbiterResultDisplayMode.result.winner === null
                  ? 0.5
                  : arbiterResultDisplayMode.pairing.players[1].color ===
                    arbiterResultDisplayMode.result.winner
                  ? 1
                  : 0
              }
            />
          </View>
        </View>
      )}
    </>
  );
};

export default ArbiterResultDisplay;
