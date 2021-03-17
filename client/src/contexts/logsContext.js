import React from "react";
import { createLogsStore } from "./logsStore";
import { useLocalObservable } from "mobx-react-lite";

const { ipcRenderer } = window.require("electron");

const LogsContext = React.createContext(null);

export const LogsProvider = ({ children }) => {
  const logsStore = useLocalObservable(createLogsStore);

  React.useEffect(() => {
    let addLogListener;

    addLogListener = (e, msg) => {
      logsStore.addLog(msg);
    };
    ipcRenderer.on("msg_recieved", addLogListener);

    return () => {
      ipcRenderer.removeListener("msg_received", addLogListener);
    };
  }, []);

  return (
    <LogsContext.Provider value={logsStore}>{children}</LogsContext.Provider>
  );
};

export const useLogsStore = () => React.useContext(LogsContext);
