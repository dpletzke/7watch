const { app, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const Datastore = require("nedb-promises");

const dbFactory = (fileName) => {
  const path = isDev ? "." : app.getAppPath("userData");
  const filename = `${path}/data/${fileName}`;
  Datastore.create({
    filename,
    timestampData: true,
    autoload: true,
  });
};

const db = {
  devices: dbFactory("devices.db"),
  observations: dbFactory("observations.db"),
  gridValues: dbFactory("gridValues.db"),
};

const replaceAllData = (db, data) => {
  return db.remove({}, { multi: true }).then(() => {
    return db.insert(data);
  });
};

// before_close_save_my_data
ipcMain.handle("save_app_state", async (event, appState) => {
  const { devices, observations, grid } = appState;

  return Promise.all([
    replaceAllData(db.devices, devices),
    replaceAllData(db.observations, observations),
    replaceAllData(db.gridValues, grid),
  ]);
});

module.exports = (win) => {
  // send the inital state of the db
  win.webContents.send("set_initial_state", db);

  // on close, let the renderer know to send the main any changes to the config, state
  win.on("close", (e) => {
    // TODO implement in renderer sending save_app_state
    win.webContents.send("closing_app");
  });
};
