/**
 * Observations that can be returning by devices, ie heart rate
 * @typedef {Object} Observation
 * @property {number} Observation.id - the OBX-3 identifier
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
     * @type {number[]}
     */
    deviceIds: [],
    /**
     * track observation types known as OBX-3 in the HL7 protocol
     * @type {Map<number, Observation>} - observation Ids
     */
    observations: new Map(),
    /**
     * Add device ids to global tracker and add grid columns for
     * each device/observation type with a starting value of null
     * @param {number[]} newDeviceIds - device ids of new devices to track
     */
    addDevices: function (newDeviceIds) {
      if (!newDeviceIds) return null;

      this.deviceIds.push(...newDeviceIds);

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
    addObservations: function (newObservations) {
      if (!newObservations) return null;

      newObservations.forEach((observation) => {
        this.observations.set(observation.id, observation);
      });
      newObservations.forEach(({ id: obId }) => {
        this.deviceIds.forEach((dId) => {
          this.grid.set(`${dId}-${obId}`, null);
        });
      });
    },
    /**
     *
     * @param {number[]} deviceIdsToRemove - array of device ids to remove
     */
    removeDevices: function (deviceIdsToRemove) {
      console.log("here");
      this.deviceIds = this.deviceIds.filter((dId) => {
        return !deviceIdsToRemove.includes(dId);
      });

      const observationIds = Array.from(this.observations.keys());
      deviceIdsToRemove.forEach((dId) => {
        observationIds.forEach((obId) => {
          this.grid.delete(`${dId}-${obId}`);
        });
      });
    },
    /**
     *
     * @param {number[]} observationsToRemove - array of observations to remove
     */
    removeObservations: function (observationsToRemove) {
      if (!observationsToRemove) return null;
      console.log(observationsToRemove);
      observationsToRemove.forEach((observation) => {
        this.observations.delete(observation.id);
      });
      observationsToRemove.forEach(({ id: obId }) => {
        this.deviceIds.forEach((dId) => {
          this.grid.delete(`${dId}-${obId}`);
        });
      });
    },
    /**
     * batched updates of dId-obId values
     * @param {Object[]} updates
     * @param {string} updates[].deviceId
     * @param {number} updates[].observationId
     * @param {number|string} updates[].value
     */
    updateValues: function (updates) {
      updates.forEach(({ deviceId, observationId, value }) => {
        // console.log(
        //   Array.from(this.observations.keys()),
        //   observationId,
        //   deviceId
        // );
        if (!Array.from(this.observations.keys()).includes(observationId)) {
          // suggest to user to add new observation
          console.error("no valid entry for observation");
          return;
        }
        if (!this.deviceIds.includes(deviceId)) {
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
      const deviceId = this.deviceIds[deviceIdIndex];

      const observationId = Array.from(this.observations.keys())[
        observationIdIndex
      ];
      return [deviceId, observationId];
    },
  };
}
