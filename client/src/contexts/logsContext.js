import React from "react";
import { createLogsStore } from "./logsStore";
import { useLocalObservable } from "mobx-react-lite";

import { normalizeMsg } from "../helpers/msgProcessing";

const { ipcRenderer } = window.require("electron");

const LogsContext = React.createContext(null);

export const LogsProvider = ({ children }) => {
  const logsStore = useLocalObservable(createLogsStore);

  React.useEffect(() => {
    const addLogListener = (e, msg) => {
      logsStore.addLog(normalizeMsg(msg));
    };

    ipcRenderer.on("msg_recieved", addLogListener);

    return () => {
      ipcRenderer.removeListener("msg_received", addLogListener);
    };
  }, [logsStore]);

  return (
    <LogsContext.Provider value={logsStore}>{children}</LogsContext.Provider>
  );
};

export const useLogsStore = () => React.useContext(LogsContext);
