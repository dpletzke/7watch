import React from "react";
import { createLogsStore } from "./logsStore";
import { useLocalStore } from "mobx-react-lite";

const { ipcRenderer } = window.require("electron");


const LogsContext = React.createContext(null);

export const LogsProvider = ({ children }) => {
  const logsStore = useLocalStore(createLogsStore);

  React.useEffect(() => {
    const addLogListener = (e, msg) => {
      console.log(msg);

      logsStore.addLog(msg);
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
