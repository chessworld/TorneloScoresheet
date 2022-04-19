import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useError } from '../context/ErrorContext';
import { negative } from '../style/colour';

// A toast that renders the current state of the "ErrorContext"
const ErrorToast: React.FC = () => {
  const [error] = useError();

  // TODO Animate in

  return error ? (
    <Animated.View style={styles.flexBox}>
      <View style={styles.container}>
        {/* TODO: Add an icon */}
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.text}>{error}</Text>
      </View>
    </Animated.View>
  ) : (
    <></>
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
