import React, { useState } from 'react';
import { View } from 'react-native';
import { useEnterPgnState } from '../../context/AppModeStateContext';
import { useError } from '../../context/ErrorContext';
import { isError } from '../../types/Result';
import { styles } from './style';

import PieceAsset from '../../components/PieceAsset/PieceAsset';
import { PieceType } from '../../types/ChessMove';
import { PlayerColour } from '../../types/ChessGameInfo';
import { colours } from '../../style/colour';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import { useArbiterInfo } from '../../context/ArbiterInfoContext';
import EditCurrentEvent from './EditCurrentEvent';
import RoundedView from '../../components/RoundedView/RoundedView';

const EnterPgn: React.FC = () => {
  const state = useEnterPgnState();

  const [loading, setLoading] = useState(false);
  const goToPairingSelection = state?.goToPairingSelection;
  const appMode = state?.state;

  const [showEditEvent, setShowEditEvent] = useState(false);
  const [arbiterInfo] = useArbiterInfo();
  const [, showError] = useError();

  const handleNextClick = async () => {
    setLoading(true);

    if (!goToPairingSelection || !arbiterInfo) {
      return;
    }

    const result = await goToPairingSelection(arbiterInfo.broadcastUrl);

    if (isError(result)) {
      showError(result.error);
      setLoading(false);
    }
  };

  return (
    <>
      {appMode && (
        <View style={styles.container}>
          <View style={styles.informationAndInputBoxContainer}>
            <PieceAsset
              piece={{ type: PieceType.King, player: PlayerColour.Black }}
              size={150}
              colour={colours.secondary}
              style={styles.piece}
            />
            <PrimaryText
              style={styles.title}
              size={38}
              weight={FontWeight.SemiBold}
              label="Arbiter Mode"
            />
            <EditCurrentEvent
              display={showEditEvent}
              dismiss={() => setShowEditEvent(false)}
            />
            {arbiterInfo !== null && (
              <RoundedView style={styles.currentEventBox}>
                <PrimaryText
                  size={30}
                  weight={FontWeight.SemiBold}
                  label="Current Event"
                />
                <PrimaryText
                  style={styles.currentEventTitle}
                  size={25}
                  weight={FontWeight.SemiBold}
                  label={arbiterInfo.eventName}
                />
                <PrimaryText
                  style={styles.currentEventDesc}
                  size={20}
                  weight={FontWeight.SemiBold}
                  label={`Arbiter Name: ${arbiterInfo.userName}`}
                />
                <PrimaryText
                  style={styles.currentEventDesc}
                  size={20}
                  weight={FontWeight.SemiBold}
                  label={`Pin: ${arbiterInfo.pin}`}
                />
                <PrimaryButton
                  style={styles.editEventButton}
                  labelStyle={styles.editEventButtonLabel}
                  onPress={() => setShowEditEvent(true)}
                  label="Edit Event"
                />
              </RoundedView>
            )}
            {arbiterInfo === null && (
              <RoundedView style={styles.currentEventBox}>
                <PrimaryText
                  size={30}
                  weight={FontWeight.SemiBold}
                  label="No Current Event"
                />
                <PrimaryText
                  style={styles.currentEventTitle}
                  size={20}
                  weight={FontWeight.Medium}
                  label="This Ipad is not currently linked to an event, please set the event to continue"
                />
                <PrimaryButton
                  style={styles.editEventButton}
                  labelStyle={styles.editEventButtonLabel}
                  onPress={() => setShowEditEvent(true)}
                  label="Set Event"
                />
              </RoundedView>
            )}
          </View>
          {arbiterInfo !== null && (
            <View style={styles.buttonBox}>
              <PrimaryButton
                style={styles.startButton}
                labelStyle={styles.startButtonLabel}
                onPress={handleNextClick}
                label="Start"
                loading={loading}
              />
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default EnterPgn;
