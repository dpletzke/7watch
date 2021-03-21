const { app, ipcMain } = require("electron");
const { replaceDatabase, retrievePreviousState } = require("./db/db.js");

module.exports = (window, gateControls) => {
  let win = window;
  const { startGate, stopGate } = gateControls;
  // TODO implement in renderer listen previous state
  retrievePreviousState()
    .then((appState) => {
      win.webContents.send("previous_state", appState);
    })
    .catch((err) => {
      console.error(err);
    });
  /**
   * since we redirect the close event, set a timer to close the app
   * if the renderer doesn't respond quick enough
   * consequence: changes in state made during that session won't be saved
   */
  let closeAssuranceTimer;
  win.on("close", (e) => {
    if (win) {
      e.preventDefault();
      // TODO implement in renderer send save_app_state
      closeAssuranceTimer = setTimeout(() => {
        win = null;
        app.quit();
        clearTimeout(closeAssuranceTimer);
      }, 3000);
      win.webContents.send("closing_app");
    }
  });

  ipcMain.handle("save_before_closing", async (event, appState) => {
    clearTimeout(closeAssuranceTimer);
    await replaceDatabase(appState);
    win = null;
    // TODO do we need this if there is already a events listener for all windows closed?
    // if (process.platform !== "darwin") {
    //   app.quit();
    // }
  });

  ipcMain.handle("start_gate", (event, config) => {
    return startGate(config);
  });

  ipcMain.handle("stop_gate", () => {
    return stopGate();
  });
};
