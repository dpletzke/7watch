import React from "react";
import { autorun } from "mobx";
import { createGridStore } from "./gridStore";
import { initialDeviceIds, initialObservations } from "./initialGrid";
import { useLocalObservable } from "mobx-react-lite";

const { ipcRenderer } = window.require("electron");

const GridContext = React.createContext(null);

export const GridProvider = ({ children }) => {
  const gridStore = useLocalObservable(createGridStore);

  React.useEffect(() => {
    //TODO command server to begin persisting logs and averages for new devices and observations

    // TODO gui tracker for when new devices or observations come through the track

    /**
     * Set up fixtures for testing
     * TODO iniate this based off of Local Storage or main process storage nedb?
     */
    gridStore.addDevices(initialDeviceIds);
    gridStore.addObservations(initialObservations);

    /**
     * Set up listener for observations coming from the main process,
     */
    let newObservationListener;
    const disposer = autorun(() => {
      newObservationListener = (e, updates) => {
        try {
          gridStore.updateValues(updates);
        } catch (err) {
          console.error(err);
        }
      };
      ipcRenderer.on("observation", newObservationListener);
    });

    return () => {
      ipcRenderer.removeListener("observation", newObservationListener);
      disposer();
    };
  }, []);

  return (
    <GridContext.Provider value={gridStore}>{children}</GridContext.Provider>
  );
};

export const useGridStore = () => React.useContext(GridContext);
