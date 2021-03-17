import React from "react";
import { useLocalObservable } from "mobx-react-lite";
import { runInAction } from "mobx";
import { config } from "../config";
const { ipcRenderer } = window.require("electron");

const GateContext = React.createContext(null);

// exported for testing only
export const createGateStore = () => {
  return {
    isOpen: false,
    open: async function () {
      if (!this.isOpen) {
        await ipcRenderer.invoke("start_gate", config);
        runInAction(() => {
          this.isOpen = true;
        });
      }
    },
    close: async function () {
      if (this.isOpen) {
        await ipcRenderer.invoke("stop_gate");
        runInAction(() => {
          this.isOpen = false;
        });
      }
    },
  };
};

export const GateProvider = ({ children }) => {
  const gateStore = useLocalObservable(createGateStore);

  return (
    <GateContext.Provider value={gateStore}>{children}</GateContext.Provider>
  );
};

export const useGateStore = () => React.useContext(GateContext);
