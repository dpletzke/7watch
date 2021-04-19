import { toJS } from "mobx";

/**
 * Observations that can be returning by devices, ie heart rate
 * @typedef {Object} Observation
 * @property {string} Observation.id - the OBX-3 identifier
 * @property {string} Observation.common - a short, unique name
 * @property {string} Observation.full - the full name.
 */

export function createGridStore() {
  return {
    /**
     * @type {Map<string, number>} - 'deviceId-observationId'
     *  current value | null
     */
    grid: new Map(),
    /**
     * @type {Set<string>}
     */
    deviceIds: new Set(),
    /**
     * track observation types known as OBX-3 in the HL7 protocol
     * @type {Map<string, Observation>} - observation Ids
     */
    observations: new Map(),
    initializeState: function (appState) {
      const { deviceIds, observations, grid } = appState;
      this.deviceIds = deviceIds;
      this.observations = observations;
      this.grid = grid;
    },
    /**
     * Add device ids to global tracker and add grid columns for
     * each device/observation type with a starting value of null
     * @param {string[]} newDeviceIds - device ids of new devices to track
     */
    addDevices: function (deviceIdsToAdd) {
      if (!deviceIdsToAdd) return null;
      //filter array for ids that we don't have already
      const newDeviceIds = deviceIdsToAdd.filter(
        (id) => !this.deviceIds.has(id)
      );
      newDeviceIds.forEach((id) => this.deviceIds.add(id));

      const observationIds = Array.from(this.observations.keys());
      newDeviceIds.forEach((dId) => {
        observationIds.forEach((obId) => {
          this.grid.set(`${dId}-${obId}`, null);
        });
      });
    },
    /**
     * Add observations to global tracker and add row elements for
     * each device with a starting value of null
     * @param {Observation[]} newObservations - new observations to track
     */
    addObservations: function (observationsToAdd) {
      if (!observationsToAdd) return null;
      //filter array for ids that we don't have already
      const newObservations = observationsToAdd.filter(
        ({ id }) => !this.observations.has(id)
      );
      newObservations.forEach((observation) => {
        this.observations.set(observation.id, observation);
      });
      newObservations.forEach(({ id: obId }) => {
        Array.from(this.deviceIds).forEach((dId) => {
          this.grid.set(`${dId}-${obId}`, null);
        });
      });
    },
    /**
     *
     * @param {string[]} deviceIdsToRemove - array of device ids to remove
     */
    removeDevices: function (deviceIdsToRemove) {
      deviceIdsToRemove.forEach((id) => this.deviceIds.delete(id));

      const observationIds = Array.from(this.observations.keys());
      deviceIdsToRemove.forEach((dId) => {
        observationIds.forEach((obId) => {
          this.grid.delete(`${dId}-${obId}`);
        });
      });
    },
    /**
     *
     * @param {string[]} observationsToRemove - array of observations to remove
     */
    removeObservations: function (observationsToRemove) {
      if (!observationsToRemove) return null;
      observationsToRemove.forEach((observation) => {
        this.observations.delete(observation);
      });
      const deviceIds = Array.from(this.deviceIds);
      observationsToRemove.forEach(({ id: obId }) => {
        deviceIds.forEach((dId) => {
          this.grid.delete(`${dId}-${obId}`);
        });
      });
    },
    /**
     * batched updates of dId-obId values
     * @param {Object[]} updates
     * @param {string} updates[].deviceId
     * @param {string} updates[].observationId
     * @param {number|string} updates[].value
     */
    updateValues: function (updates) {
      updates.forEach(({ deviceId, observationId, value }) => {
        if (!this.observations.has(observationId)) {
          // suggest to user to add new observation
          console.error("no valid entry for observation");
          return;
        }
        if (!this.deviceIds.has(deviceId)) {
          // suggest to user to add new device
          console.error("no valid entry for device");
          return;
        }
        const key = `${deviceId}-${observationId}`;
        if (!this.grid.has(key)) {
          console.error("Error: invalid in-memory datastore");
          return;
        }
        this.grid.set(key, value);
      });
    },
    getValue: function (deviceId, observationId) {
      const key = `${deviceId}-${observationId}`;
      if (!this.grid.has(key)) {
        console.error("no valid entry for device-observation");
      }
      return this.grid.get(key);
    },
    getIds: function (deviceIdIndex, observationIdIndex) {
      const deviceId = Array.from(this.deviceIds)[deviceIdIndex];

      const observationId = Array.from(this.observations.keys())[
        observationIdIndex
      ];
      return [deviceId, observationId];
    },
  };
}
