import React, { useContext, useRef, useState } from 'react';

// Global state for a error to display to the user
// (Only one error can be displayed at once)
// This is used in "ErrorToast" to present the error
const ErrorContext = React.createContext<
  [string | undefined, React.Dispatch<React.SetStateAction<string | undefined>>]
>([undefined, () => undefined]);

// Custom hook to show and read the current error
export const useError = (): [string | undefined, (val: string) => void] => {
  const [error, setError] = useContext(ErrorContext);
  // Ref to a timer so we can clear it when a new error arrives
  const timeoutRef = useRef<null | NodeJS.Timeout>(null);

  const showError = (newError: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Hide the error message after a timeout
    timeoutRef.current = setTimeout(
      () => setError(undefined),
      // This is based on reading speed of 200WPM, with an average word length of 5 characters per word
      // We want it to be at least a second though
      Math.max(1000, newError.length * 59),
    );
    setError(newError);
  };

  return [error, showError];
};

export const ErrorContextProvider: React.FC = ({ children }) => {
  const errorState = useState<string | undefined>(undefined);

  return (
    <ErrorContext.Provider value={errorState}>{children}</ErrorContext.Provider>
  );
};
