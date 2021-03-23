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
      console.log("win on close");
      // TODO implement in renderer send save_app_state
      win.webContents.send("closing_app");
      closeAssuranceTimer = setTimeout(() => {
        win = null;
        console.log("timeout close");
        // TODO uncomment before ship
        // app.quit();
        clearTimeout(closeAssuranceTimer);
      }, 3000);
    }
  });

  ipcMain.on("save_before_closing", () => {
    clearTimeout(closeAssuranceTimer);
    console.log("here");
    replaceDatabase(appState)
      .then(() => {
        win = null;
        console.log("recieve save-before-closing");
        // TODO do we need this if there is already a events listener for all windows closed?
        // if (process.platform !== "darwin") {
        //   app.quit();
        // }
      })
      .catch((err) => {
        console.errror(err);
      });
  });

  ipcMain.handle("start_gate", (event, config) => {
    return startGate(config);
  });

  ipcMain.handle("stop_gate", () => {
    return stopGate();
  });
};
