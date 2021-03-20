const { ipcMain } = require("electron");
const { replaceDatabase, retrievePreviousState } = require("./db/db.js");

module.exports = (win, gateControls) => {
  const { startGate, stopGate } = gateControls;
  // TODO implement in renderer listen previous state
  win.webContents.send("previous_state", retrievePreviousState());

  win.on("close", (e) => {
    e.preventDefault();
    // TODO implement in renderer send save_app_state
    win.webContents.send("closing_app");
  });

  ipcMain.handle("save_before_closing", async (event, appState) => {
    await replaceDatabase(appState);
  });

  ipcMain.handle("start_gate", (event, config) => {
    return startGate(config);
  });

  ipcMain.handle("stop_gate", () => {
    return stopGate();
  });
};
