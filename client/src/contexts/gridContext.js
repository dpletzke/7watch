import React from "react";
import { useLocalObservable } from "mobx-react-lite";
import { createGridStore } from "./gridStore";
import { initialDeviceIds, initialObservations } from "./initialGrid";
import { msgToUpdates } from "../helpers/msgProcessing";

const { ipcRenderer } = window.require("electron");

const GridContext = React.createContext(null);

export const GridProvider = ({ children }) => {
  const gridStore = useLocalObservable(createGridStore);

  React.useEffect(() => {
    //TODO command server to begin persisting logs and averages for new devices and observations

    // TODO gui tracker for when new devices or observations come through the track

    /**
     * Set up fixtures for testing
     * TODO initialize this based off of previous state
     */
    gridStore.addDevices(initialDeviceIds);
    gridStore.addObservations(initialObservations);

    /**
     * Set up value fixtures for testing
     * TODO initialize this based off of previous state
     */

    const updates = [];
    initialDeviceIds.forEach((deviceId) => {
      initialObservations.forEach(({ id }) => {
        updates.push({
          deviceId,
          observationId: Number(id),
          value: Math.trunc(Math.random() * 1000),
        });
      });
    });
    gridStore.updateValues(updates);

    /**
     * Set up listener for observations coming from the main process,
     */
    let newObservationListener;
    newObservationListener = (e, msg) => {
      const parsedMsg = msgToUpdates(msg);
      gridStore.updateValues(parsedMsg);
    };
    ipcRenderer.on("observation_report", newObservationListener);

    return () => {
      ipcRenderer.removeListener("observation", newObservationListener);
    };
  }, []);

  return (
    <GridContext.Provider value={gridStore}>{children}</GridContext.Provider>
  );
};

export const useGridStore = () => React.useContext(GridContext);
