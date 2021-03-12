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
      const addGridRows = newDeviceIds.reduce((acc, dId) => {
        acc.push(
          ...Object.keys(this.observations).map((obId) => {
            return [`${dId}-${obId}`, null];
          })
        );
        return acc;
      }, []);
      console.log(addGridRows);
      this.grid.set(addGridRows);
    },
    /**
     * Add observations to global tracker and add row elements for
     * each device with a starting value of null
     * @param {Obervations[]} newObservations - new observations to track
     * @see {@link observations}
     */
    addObservations: function (newObservations) {
      this.observations = { ...this.observations, ...newObservations };
      const addGridColumns = Object.keys(newObservations).reduce(
        (acc, obId) => {
          acc.push(
            ...this.deviceIds.map((dId) => {
              return [`${dId}-${obId}`, null];
            })
          );
          return acc;
        },
        []
      );
      this.grid.set(addGridColumns);
    },
    updateValue: function (deviceId, observationId, value) {
      const key = `${deviceId}-${observationId}`;
      if (!this.grid.has(key)) {
        throw new Error("no valid entry for device-observation");
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
