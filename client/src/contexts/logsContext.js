import React from "react";
import { createLogsStore } from "./logsStore";
import { useLocalObservable } from "mobx-react-lite";
import { autorun } from "mobx";

import { normalizeMsg } from "../helpers/msgProcessing";

const { ipcRenderer } = window.require("electron");

const LogsContext = React.createContext(null);

export const LogsProvider = ({ children }) => {
  const logsStore = useLocalObservable(createLogsStore);

  React.useEffect(() => {
    let addLogListener;
    const disposer = autorun(() => {
      addLogListener = (e, msg) => {
        logsStore.addLog(normalizeMsg(msg));
      };
      ipcRenderer.on("msg_recieved", addLogListener);
    });

    return () => {
      ipcRenderer.removeListener("msg_received", addLogListener);
      disposer();
    };
  }, []);

  return (
    <LogsContext.Provider value={logsStore}>{children}</LogsContext.Provider>
  );
};

export const useLogsStore = () => React.useContext(LogsContext);
