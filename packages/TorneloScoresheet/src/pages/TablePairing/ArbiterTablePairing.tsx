import React from 'react';
import { useArbiterTablePairingState } from '../../context/AppModeStateContext';
import { styles } from './style';
import { View } from 'react-native';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import { colours } from '../../style/colour';
import { chessGameIdentifier } from '../../util/chessGameInfo';

const ArbiterTablePairing: React.FC = () => {
  const arbiterTablePairingState = useArbiterTablePairingState();
  const tablePairingMode = arbiterTablePairingState?.[0];
  const infoString = `Board ${
    tablePairingMode?.pairing
      ? chessGameIdentifier(tablePairingMode?.pairing)
      : '[Unknown Game]'
  }`;

  return (
    <>
      {tablePairingMode && (
        <View style={styles.container}>
          <PrimaryText
            weight={FontWeight.Regular}
            size={70}
            style={styles.title}
            label={infoString}
            colour={colours.darkenedElements}
          />
          <View style={styles.playerCardContainer}>
            <PlayerCard player={tablePairingMode.pairing.players[0]} />
            <View style={styles.horizontalSeparator} />
            <PlayerCard player={tablePairingMode.pairing.players[1]} />
          </View>
        </View>
      )}
    </>
  );
};

export default ArbiterTablePairing;
