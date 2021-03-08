import React from "react";
import { createLogsStore } from "./logsStore";
import { useLocalObservable } from "mobx-react-lite";

const LogsContext = React.createContext(null);

export const LogsProvider = ({ children }) => {
  const logsStore = useLocalObservable(createLogsStore);

  return (
    <LogsContext.Provider value={logsStore}>{children}</LogsContext.Provider>
  );
};

export const useLogsStore = () => React.useContext(LogsContext);
