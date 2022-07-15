import { useContext } from "react";
import { AppMode, AppModeState, ResultDisplayMode } from "../../types/AppModeState";

type ResultDisplayStateHookType = [
    ResultDisplayMode,
    {
    },
  ];

  export const makeUseResultDisplayState =
  (
    context: React.Context<
      [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
    >,
  ): (() => ResultDisplayStateHookType | null) =>
  (): ResultDisplayStateHookType | null => {
    const [appModeState] = useContext(context);
    if (appModeState.mode !== AppMode.ResultDisplay) {
      return null;
    }

    return [appModeState, {}];
  };