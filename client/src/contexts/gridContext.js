import React from "react";
import { autorun } from "mobx";
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
    const updates = Array.from(gridStore.grid.keys()).map((id) => {
      const [deviceId, observationId] = id.split("-");
      return {
        deviceId,
        observationId: Number(observationId),
        value: Math.trunc(Math.random() * 1000),
      };
    });
    gridStore.updateValues(updates);

    /**
     * Set up listener for observations coming from the main process,
     */
    let newObservationListener;
    const disposer = autorun(() => {
      newObservationListener = (e, msg) => {
        gridStore.updateValues(msgToUpdates(msg));
      };
      ipcRenderer.on("observation_report", newObservationListener);
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
