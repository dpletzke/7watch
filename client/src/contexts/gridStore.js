// this will be a

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
     * @property {object} [obId] - observation id, the OBX-3 identifier
     * @property {number} [obId].id - the OBX-3 identifier
     * @property {number} [obId].common - a short, unique name
     * @property {number} [obId].full - the full name
     */
    observations: {},
    /**
     * Add device ids to global tracker and add grid columns for
     * each device/observation type with a starting value of null
     * @param {number[]} newDeviceIds - device ids of new devices to track
     */
    addDevices: function (newDeviceIds) {
      this.deviceIds.push(...newDeviceIds);
      const observationIds = Object.keys(this.observations);
      newDeviceIds.forEach((dId) => {
        observationIds.forEach((obId) => {
          this.grid.set(`${dId}-${obId}`, null);
        });
      });
    },
    /**
     * Add observations to global tracker and add row elements for
     * each device with a starting value of null
     * @param {Obervations[]} newObservations - new observations to track
     * @see observations
     */
    addObservations: function (newObservations) {
      this.observations = newObservations.reduce(
        (acc, observation) => {
          acc[observation.id] = observation;
          return acc;
        },
        { ...this.observations }
      );
      newObservations.forEach(({ id: obId }) => {
        this.deviceIds.forEach((dId) => {
          this.grid.set(`${dId}-${obId}`, null);
        });
      });
    },
    updateValue: function (deviceId, observationId, value) {
      if (!Object.keys(this.observations).includes(observationId)) {
        // suggest to user to add new observation
        throw new Error("no valid entry for observation");
      }
      if (!this.deviceIds.includes(deviceId)) {
        // suggest to user to add new device
        throw new Error("no valid entry for device");
      }
      const key = `${deviceId}-${observationId}`;
      if (!this.grid.has(key)) {
        throw new Error("Error: invalid in-memory datastore");
      }
      this.grid.set(key, value);
    },
    getValue: function (deviceId, observationId) {
      const key = `${deviceId}-${observationId}`;
      if (!this.grid.has(key)) {
        throw new Error("no valid entry for device-observation");
      }
      return this.grid.get(key);
    },
  };
}
