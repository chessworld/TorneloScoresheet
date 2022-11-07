import React, { useEffect, useState } from 'react';
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
import { ArbiterInfo } from '../../types/ArbiterInfoState';
import { useError } from '../../context/ErrorContext';
import { validUrl } from '../../util/url';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { BarCodeReadEvent } from 'react-native-camera';

export type EditCurrentEventParams = {
  display: boolean;
  isQrMode: boolean;
  dismiss: () => void;
};
const EditCurrentEvent: React.FC<EditCurrentEventParams> = ({
  dismiss,
  isQrMode,
  display,
}) => {
  const [arbiterInfo, setArbiterInfo] = useArbiterInfo();
  const [, showError] = useError();

  const [arbiterPin, setArbiterPin] = useState(arbiterInfo?.pin ?? '');
  const [pgnUrl, setPgnUrl] = useState(arbiterInfo?.broadcastUrl ?? '');
  const [arbiterEmailSecret, setArbiterEmailSecret] = useState(
    arbiterInfo?.arbiterToken ?? '',
  );
  const [divisionId, setDivisionId] = useState(arbiterInfo?.divisionId ?? '');
  const [arbiterId, setArbiterId] = useState(arbiterInfo?.userId ?? '');
  const [eventName, setEventName] = useState(arbiterInfo?.eventName ?? '');
  const [arbiterName, setArbiterName] = useState(arbiterInfo?.userName ?? '');

  useEffect(() => {
    setArbiterPin(arbiterInfo?.pin ?? '');
    setPgnUrl(arbiterInfo?.broadcastUrl ?? '');
    setArbiterEmailSecret(arbiterInfo?.arbiterToken ?? '');
    setDivisionId(arbiterInfo?.divisionId ?? '');
    setArbiterId(arbiterInfo?.userId ?? '');
    setArbiterName(arbiterInfo?.userName ?? '');
    setEventName(arbiterInfo?.eventName ?? '');
  }, [arbiterInfo]);

  const inputBoxesContent: [
    string,
    React.Dispatch<React.SetStateAction<string>>,
    string,
  ][] = [
    [pgnUrl, setPgnUrl, 'Tournament url'],
    [arbiterPin, setArbiterPin, 'Arbiter pin'],
    [arbiterEmailSecret, setArbiterEmailSecret, 'Arbiter email secret'],
    [divisionId, setDivisionId, 'Division id'],
    [arbiterId, setArbiterId, 'Arbiter id'],
    [arbiterName, setArbiterName, 'Arbiter name'],
    [eventName, setEventName, 'Event name'],
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
      <Sheet title="Edit event" dismiss={dismiss} visible={display}>
        {/* QR Code Entry */}
        {isQrMode && (
          <View style={styles.editEventSheetSection}>
            <QRCodeScanner
              onRead={handleQrCodeScanned}
              containerStyle={styles.qrScanningContainer}
              cameraStyle={styles.qrScanningCamera}
            />
          </View>
        )}
        {/* Text Box Entry */}
        {!isQrMode && (
          <ScrollView style={styles.editEventSheetSection}>
            <KeyboardAvoidingView behavior="height">
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
