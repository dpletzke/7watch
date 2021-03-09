import React from "react";
import { useLocalObservable } from "mobx-react-lite";
import { config } from "../config";
const { ipcRenderer } = window.require("electron");

const GateContext = React.createContext(null);

export const GateProvider = ({ children }) => {
  const gateStore = useLocalObservable(() => {
    return {
      isOpen: false,
      open: async function () {
        if (!this.isOpen) {
          await ipcRenderer.invoke("start_gate", config);
          this.isOpen = true;
        }
      },
      close: async function () {
        if (this.isOpen) {
          await ipcRenderer.invoke("stop_gate");
          this.isOpen = false;
        }
      },
    };
  });

  return (
    <GateContext.Provider value={gateStore}>{children}</GateContext.Provider>
  );
};

export const useGateStore = () => React.useContext(GateContext);
