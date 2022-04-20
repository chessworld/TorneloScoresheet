import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { useError } from '../context/ErrorContext';
import { negative } from '../style/colour';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
          <Text style={styles.errorTitle}>Error</Text>
        </View>
        <Text style={styles.text}>{internalError}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flexBox: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
  container: {
    backgroundColor: negative,
    left: 10,
    top: 40,
    padding: 20,
    borderRadius: 10,
    minWidth: 120,
    maxWidth: '80%',
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  icon: {
    marginRight: 8,
    marginBottom: 2,
  },
  text: {
    color: 'white',
    fontWeight: '600',
  },
  errorTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
    marginBottom: 4,
  },
});

export default ErrorToast;
