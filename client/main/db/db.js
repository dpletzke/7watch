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

const replaceAllData = (db, data) => {
  return db.remove({}, { multi: true }).then(() => {
    return db.insert(data);
  });
};

const replaceDatabase = (appState) => {
  const { devices, observations, grid, config } = appState;

  return Promise.all([
    replaceAllData(db.devices, devices),
    replaceAllData(db.observations, observations),
    replaceAllData(db.gridValues, grid),
    replaceAllData(db.config, config),
  ]);
};

const retrievePreviousState = () => {
  return Promise.all([
    db.devices.find({}),
    db.observations.find({}),
    db.gridValues.find({}),
    db.config.find({}),
  ]);
};

module.exports = { replaceDatabase, retrievePreviousState };
