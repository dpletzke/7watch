import React from "react";
import { useLocalObservable } from "mobx-react-lite";
import { toJS, action } from "mobx";
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
     * Set up listener for observations coming from the main process,
     * set in Logs page
     */
    const newObservationListener = action((e, msg) => {
      const parsedMsg = msgToUpdates(msg);
      gridStore.updateValues(parsedMsg);
    });
    ipcRenderer.on("observation_report", newObservationListener);

    /**
     * Setup Listener for initializing state after open
     */
    const appOpeningListener = action((e, previousState) => {
      const { devices, observations, grid, config } = previousState;
      console.log("setting preivous state", previousState);
      gridStore.initializeState({ deviceIds: devices, observations, grid });
    });
    ipcRenderer.on("set_previous_state_after_open", appOpeningListener);

    /**
     * Setup Listener for saving state before close
     */
    const appClosingListener = (e) => {
      const appState = {
        devices: toJS(gridStore.deviceIds),
        observations: toJS(gridStore.observations),
        grid: toJS(gridStore.grid),
        config: {},
      };
      ipcRenderer.send("save_before_closing", appState);
    };
    ipcRenderer.on("closing_app", appClosingListener);

    return () => {
      ipcRenderer.removeListener("observation", newObservationListener);
      ipcRenderer.removeListener("closing_app", appClosingListener);
      ipcRenderer.removeListener(
        "set_previous_state_after_open",
        appOpeningListener
      );
    };
  }, []);

  return (
    <GridContext.Provider value={gridStore}>{children}</GridContext.Provider>
  );
};

export const useGridStore = () => React.useContext(GridContext);
