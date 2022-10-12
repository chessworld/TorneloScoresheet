import React, { useState } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';

import { styles } from './style';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import InputBox from '../../components/InputBox/InputBox';

import { useArbiterInfo } from '../../context/ArbiterInfoContext';
import Sheet from '../../components/Sheet/Sheet';
import { ScrollView } from 'react-native-gesture-handler';
import IconButton from '../../components/IconButton/IconButton';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import Link from '../../components/Link/Link';
import { torneloUrl } from '../../util/env';
import { ArbiterInfo } from '../../types/ArbiterInfoState';
import { useError } from '../../context/ErrorContext';
import { validUrl } from '../../util/url';
import { colours } from '../../style/colour';
import TextIconButton from '../../components/TextIconButton/TextIconButton';
import { ICON_QR, ICON_TEXT } from '../../style/images';
import { withDecay } from 'react-native-reanimated';

export type EditCurrentEventParams = {
  display: boolean;
  dismiss: () => void;
};
const EditCurrentEvent: React.FC<EditCurrentEventParams> = ({
  dismiss,
  display,
}) => {
  const [arbiterInfo, setArbiterInfo] = useArbiterInfo();
  const [, showError] = useError();

  const [inScanQRMode, setInScanQRMode] = useState(true);

  const [arbiterPin, setArbiterPin] = useState(arbiterInfo?.pin ?? '');
  const [pgnUrl, setPgnUrl] = useState(arbiterInfo?.broadcastUrl ?? '');
  const [arbiterEmailSecret, setArbiterEmailSecret] = useState(
    arbiterInfo?.arbiterToken ?? '',
  );
  const [divisionId, setDivisionId] = useState(arbiterInfo?.divisionId ?? '');
  const [arbiterId, setArbiterId] = useState(arbiterInfo?.userId ?? '');
  const [eventName, setEventName] = useState(arbiterInfo?.eventName ?? '');
  const [arbiterName, setArbiterName] = useState(arbiterInfo?.userName ?? '');

  const inputBoxesContent: [
    string,
    React.Dispatch<React.SetStateAction<string>>,
    string,
  ][] = [
    [pgnUrl, setPgnUrl, 'Tournament Url'],
    [arbiterPin, setArbiterPin, 'Arbiter Pin'],
    [arbiterEmailSecret, setArbiterEmailSecret, 'Arbiter Email Secret'],
    [divisionId, setDivisionId, 'Division Id'],
    [arbiterId, setArbiterId, 'Arbiter Id'],
    [arbiterName, setArbiterName, 'Arbiter Name'],
    [eventName, setEventName, 'Event Name'],
  ];

  const validateArbiterInfo = (arbiterInfo: ArbiterInfo): boolean => {
    if (arbiterInfo.arbiterToken == '') {
      showError('Arbiter Email token cannot be blank');
      return false;
    }
    if (arbiterInfo.divisionId == '') {
      showError('Division Id cannot be blank');
      return false;
    }
    if (arbiterInfo.eventName == '') {
      showError('Event Name cannot be blank');
      return false;
    }
    if (arbiterInfo.userName == '') {
      showError('Arbiter Name cannot be blank');
      return false;
    }
    if (arbiterInfo.userId == '') {
      showError('Arbiter Id cannot be blank');
      return false;
    }
    if (arbiterInfo.pin == '') {
      showError('Arbiter Pin cannot be blank');
      return false;
    }
    if (!validUrl(arbiterInfo.broadcastUrl)) {
      showError('Invalid Pgn Url');
      return false;
    }
    return true;
  };

  const confirmArbiterInfo = async (): Promise<void> => {
    const newArbiterInfo: ArbiterInfo = {
      pin: arbiterPin,
      broadcastUrl: pgnUrl,
      arbiterToken: arbiterEmailSecret,
      divisionId,
      userId: arbiterId,
      userName: arbiterName,
      eventName,
    };
    dismiss();

    if (validateArbiterInfo(newArbiterInfo)) {
      await setArbiterInfo(newArbiterInfo);
    }
  };
  return (
    <>
      <Sheet title="Edit Event" dismiss={dismiss} visible={display}>
        <View style={styles.editEventHeader}>
          <TextIconButton
            Icon={inScanQRMode ? ICON_TEXT : ICON_QR}
            text={inScanQRMode ? 'Text Input' : 'QR Input'}
            buttonHeight={60}
            style={styles.switchInputModeButton}
            buttonTextStyle={styles.switchInputModeButtonText}
            onPress={() => setInScanQRMode(!inScanQRMode)}
          />
          <PrimaryText
            size={26}
            weight={FontWeight.Medium}
            style={styles.instructions}>
            Go to{' '}
            <Link
              style={styles.instructionsLink}
              label="tornelo.com"
              link={torneloUrl}
            />{' '}
            and either generate a QR code or manually edit the fields.
          </PrimaryText>
        </View>
        {/* QR Code Entry */}
        {inScanQRMode && (
          <View style={styles.editEventSheetSection}>
            {/* Placeholder - QR Code scanning camera section will go here call confirmArbiterInfo() once the qr code has scanned and everything will be saved!*/}
            <View style={styles.placeholderQRSection}>
              <PrimaryText label="QR CODE PLACEHOLDER" size={60}></PrimaryText>
            </View>
          </View>
        )}
        {/* Text Box Entry */}
        {!inScanQRMode && (
          <ScrollView style={styles.editEventSheetSection}>
            <KeyboardAvoidingView behavior="padding">
              <View style={styles.informationAndInputBoxContainer}>
                <View style={styles.inputBoxesContainer}>
                  {inputBoxesContent.map((inputBoxContent, key) => (
                    <InputBox
                      key={key}
                      style={styles.inputBox}
                      value={inputBoxContent[0]}
                      onChangeText={inputBoxContent[1]}
                      placeholder={inputBoxContent[2]}
                    />
                  ))}
                </View>
              </View>
              <View style={styles.saveEventButtonBox}>
                <PrimaryButton
                  style={styles.saveEventButton}
                  labelStyle={styles.saveEventButtonLabel}
                  onPress={confirmArbiterInfo}
                  label="Save"
                />
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        )}
      </Sheet>
    </>
  );
};

export default EditCurrentEvent;
