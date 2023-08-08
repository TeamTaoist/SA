import React, { useReducer, createContext, useContext } from "react";

interface IState {
  twitter_data: any;
}
export enum StepActionType {
  SET_TWITTER_DATA = "set_twitter_data",
}

interface IAction {
  type: StepActionType;
  payload: any;
}

const INIT_STATE: IState = {
  twitter_data: null,
};

const StepContext = createContext<{
  state: IState;
  dispatch: React.Dispatch<IAction>;
}>({
  state: INIT_STATE,
  dispatch: () => null,
});

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case StepActionType.SET_TWITTER_DATA:
      return { ...state, twitter_data: action.payload };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

const StepProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, { ...INIT_STATE });

  return (
    <StepContext.Provider value={{ state, dispatch }}>
      {children}
    </StepContext.Provider>
  );
};

export const useStepContext = () => ({ ...useContext(StepContext) });

export default StepProvider;
