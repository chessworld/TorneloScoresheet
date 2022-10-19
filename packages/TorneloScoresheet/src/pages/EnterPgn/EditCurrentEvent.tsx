import React, { useState } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';

import { styles } from './style';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import InputBox from '../../components/InputBox/InputBox';

import { useArbiterInfo } from '../../context/ArbiterInfoContext';
import Sheet from '../../components/Sheet/Sheet';
import { ScrollView } from 'react-native-gesture-handler';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import Link from '../../components/Link/Link';
import { torneloUrl } from '../../util/env';
import { ArbiterInfo } from '../../types/ArbiterInfoState';
import { useError } from '../../context/ErrorContext';
import { validUrl } from '../../util/url';
import TextIconButton from '../../components/TextIconButton/TextIconButton';
import { ICON_QR, ICON_TEXT } from '../../style/images';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { BarCodeReadEvent } from 'react-native-camera';

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
    const validationError = Object.entries(arbiterInfo)
      .map(([fieldName, fieldValue]) => {
        if (fieldName === 'broadcastUrl') {
          if (!validUrl(fieldValue)) {
            return 'Error, the Broadcast URL is not in the correct format!';
          }
        }
        if (fieldValue === '') {
          return `Error, the ${fieldName} cannot be blank!`;
        }
        return null;
      })
      .find(
        (validStatus: string | null): validStatus is string =>
          validStatus !== null,
      );
    if (validationError) {
      showError(validationError);
      return false;
    }
    return true;
  };

  const confirmArbiterInfo = async (): Promise<void> => {
    const newArbiterInfo: ArbiterInfo = {
      pin: arbiterPin.trim().replace(/^\s+|\s+$/g, ''),
      broadcastUrl: pgnUrl.trim().replace(/^\s+|\s+$/g, ''),
      arbiterToken: arbiterEmailSecret.trim().replace(/^\s+|\s+$/g, ''),
      divisionId: divisionId.trim().replace(/^\s+|\s+$/g, ''),
      userId: arbiterId.trim().replace(/^\s+|\s+$/g, ''),
      userName: arbiterName.trim().replace(/^\s+|\s+$/g, ''),
      eventName: eventName.trim().replace(/^\s+|\s+$/g, ''),
    };
    dismiss();

    if (validateArbiterInfo(newArbiterInfo)) {
      await setArbiterInfo(newArbiterInfo);
    }
  };

  const handleQrCodeScanned = async (e: BarCodeReadEvent) => {
    try {
      const data = JSON.parse(e.data);
      const arbiterInfo = data as ArbiterInfo;

      setPgnUrl(arbiterInfo.broadcastUrl);
      setArbiterEmailSecret(arbiterInfo.arbiterToken);
      setDivisionId(arbiterInfo.divisionId);
      setArbiterId(arbiterInfo.userId);
      setArbiterName(arbiterInfo.userName);
      setArbiterPin(arbiterInfo.pin);
      setEventName(arbiterInfo.eventName);

      await confirmArbiterInfo();
    } catch {
      // bar code incorrect
      showError(
        'QR code incorrect! Please make sure you are scanning the QR code from tornelo.com',
      );
      dismiss();
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
            <QRCodeScanner
              onRead={handleQrCodeScanned}
              containerStyle={styles.qrScanningContainer}
              cameraStyle={styles.qrScanningCamera}
            />
          </View>
        )}
        {/* Text Box Entry */}
        {!inScanQRMode && (
          <ScrollView style={styles.editEventSheetSection}>
            <KeyboardAvoidingView behavior="padding">
              <View style={styles.informationAndInputBoxContainer}>
                <View style={styles.inputBoxesContainer}>
                  {inputBoxesContent.map((inputBoxContent, key) => (
                    <View key={key}>
                      <PrimaryText
                        size={30}
                        weight={FontWeight.SemiBold}
                        label={inputBoxContent[2]}
                      />
                      <InputBox
                        style={styles.inputBox}
                        value={inputBoxContent[0]}
                        onChangeText={inputBoxContent[1]}
                        placeholder={inputBoxContent[2]}
                      />
                    </View>
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
