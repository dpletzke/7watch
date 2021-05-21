const { app } = require("electron");
const isDev = require("electron-is-dev");
const Datastore = require("nedb-promises");

const dbFactory = (fileName) => {
  const path = isDev ? "." : app.getAppPath("userData");
  const filename = `${path}/data/${fileName}`;
  return Datastore.create({
    filename,
    timestampData: true,
    autoload: true,
  });
};

const db = {
  devices: dbFactory("devices.db"),
  observations: dbFactory("observations.db"),
  gridValues: dbFactory("gridValues.db"),
  config: dbFactory("config.db"),
};

/**
 * packing functions, functions that transform state data
 * into somthing saveable in the db, ie arrays of objects
 */
const pack = {
  devices: (deviceIds) => {
    return Array.from(deviceIds.values()).map((dId) => {
      return { deviceId: dId };
    });
  },
  observations: (observations) => {
    return Array.from(observations.values());
  },
  grid: (grid) => {
    return Array.from(grid.entries()).map(([compositeKey, value]) => {
      return { compositeKey, value };
    });
  },
  // TODO implement config packing
  // config:
};

/**
 * unpacking functions, functions that transform database data
 * into somthing settable in mobx, ie Maps
 */
const unpack = {
  devices: (deviceIds) => {
    return deviceIds.reduce((acc, { deviceId }) => {
      acc.add(deviceId);
      return acc;
    }, new Set());
  },
  observations: (observations) => {
    return observations.reduce((acc, observation) => {
      const { id, common, full } = observation;
      acc.set(id, { id, common, full });
      return acc;
    }, new Map());
  },
  grid: (grid) => {
    return grid.reduce((acc, gridValue) => {
      acc.set(gridValue.compositeKey, gridValue.value);
      return acc;
    }, new Map());
  },
  // TODO implement config unpacking
  // config:
};

const replaceData = (db, data) => {
  return db.remove({}, { multi: true }).then((result) => {
    return db.insert(data);
  });
};

const replaceDatabase = (appState) => {
  const { devices, observations, grid, config } = appState;

  const packed = {
    devices: pack.devices(devices),
    observations: pack.observations(observations),
    grid: pack.grid(grid),
  };

  return Promise.all([
    replaceData(db.devices, packed.devices),
    replaceData(db.observations, packed.observations),
    replaceData(db.gridValues, packed.grid),
    // replaceData(db.config, packed.config),
  ]);
};

const retrievePreviousState = () => {
  return Promise.all([
    db.devices.find({}),
    db.observations.find({}),
    db.gridValues.find({}),
    db.config.find({}),
  ]).then(([devices, observations, gridValues, config]) => {
    return {
      devices: unpack.devices(devices),
      observations: unpack.observations(observations),
      grid: unpack.grid(gridValues),
      // config: unpack.config(config)
    };
  });
};

module.exports = { replaceDatabase, retrievePreviousState };
