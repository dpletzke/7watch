import React from "react";
import { createGridStore } from "./gridStore";
import { useLocalObservable } from "mobx-react-lite";

const { ipcRenderer } = window.require("electron");

const GridContext = React.createContext(null);

export const GridProvider = ({ children }) => {
  const gridStore = useLocalObservable(createGridStore);

  React.useEffect(() => {
    //TODO command server to begin persisting logs and averages

    // TODO provide events and a gui tracker for when new devices or observations come through the track
    const newObservationListener = (e, msg) => {
      const { deviceId, observationId, value } = msg;
      gridStore.updateValue(deviceId, observationId, value);
    };

    ipcRenderer.on("observation", newObservationListener);

    return () => {
      ipcRenderer.removeListener("observation", newObservationListener);
    };
  }, [gridStore]);

  return (
    <GridContext.Provider value={gridStore}>{children}</GridContext.Provider>
  );
};

export const useGridStore = () => React.useContext(GridContext);
