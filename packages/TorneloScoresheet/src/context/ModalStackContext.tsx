import React, { useContext, useEffect, useMemo, useState } from 'react';

type ModalHook = {
  shown: boolean;
};

// Global state for a stack of currently shown modals.
// Unfortunately, React Native doesn't allow more than one
// modal to be open at a time, so, we manage a stack of all
// "open" modals, and only allow the top one to be shown
const ModalStackContext = React.createContext<
  [string[], React.Dispatch<React.SetStateAction<string[]>>]
>([[], () => undefined]);

// Custom hook to register yourself as a modal on the global
// modal stack. The hook tells you whether you are currently
// visible or not (i.e. whether you are the top of the stack)
export const useModal = (id: string, visible: boolean): ModalHook => {
  const [stack, setStack] = useContext(ModalStackContext);

  useEffect(() => {
    setStack(s => {
      if (visible && s.indexOf(id) < 0) {
        return [...s, id];
      } else if (!visible && s.indexOf(id) >= 0) {
        return s.filter(modalId => modalId !== id);
      }
      return s;
    });
  }, [visible, id, setStack]);

  return {
    shown: useMemo(
      () => visible && stack[stack.length - 1] === id,
      [stack, visible, id],
    ),
  };
};

export const ModalStackContextProvider: React.FC = ({ children }) => {
  const modalStack = useState<string[]>([]);

  return (
    <ModalStackContext.Provider value={modalStack}>
      {children}
    </ModalStackContext.Provider>
  );
};
