import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { useError } from '../../context/ErrorContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './style';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';

// A toast that renders the current state of the "ErrorContext"
const ErrorToast: React.FC = () => {
  const [error] = useError();

  // We 'cache' the error so we can keep rendering it until after
  // the popOut animation finishes
  const [internalError, setInternalError] = useState('');
  const clearError = () => setInternalError('');

  // Initial location for the toast should be above the screen
  const windowHeight = Dimensions.get('window').height;
  const popAnim = useRef(new Animated.Value(windowHeight * -1)).current;

  const popOut = useCallback(() => {
    Animated.timing(popAnim, {
      toValue: windowHeight * -1,
      duration: 300,
      useNativeDriver: true,
    }).start(clearError);
  }, [popAnim, windowHeight]);

  const popIn = useCallback(() => {
    Animated.timing(popAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [popAnim]);

  // Each time the error changes, render the appropriate animation
  useEffect(() => {
    if (error) {
      setInternalError(error);
      popIn();
    } else {
      popOut();
    }
  }, [popIn, popOut, error]);

  return (
    <Animated.View
      style={[
        styles.flexBox,
        {
          transform: [{ translateY: popAnim }],
        },
      ]}>
      <View style={styles.container}>
        <View style={styles.titleRow}>
          <Icon name="warning" style={styles.icon} size={30} color="white" />
          <PrimaryText
            size={20}
            colour="white"
            style={styles.errorTitle}
            weight={FontWeight.Bold}
            label="Error"
          />
        </View>
        <PrimaryText
          colour="white"
          weight={FontWeight.SemiBold}
          label={internalError}
        />
      </View>
    </Animated.View>
  );
};

export default ErrorToast;
