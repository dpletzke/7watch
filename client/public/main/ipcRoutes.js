const { app, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const fs = require("fs").promises;

const { replaceDatabase, retrievePreviousState } = require("./db/db.js");

module.exports = (window, gateControls) => {
  let win = window;
  const { startGate, stopGate } = gateControls;

  win.once("ready-to-show", () => {
    console.log("ready-to-show");
    retrievePreviousState()
      .then((appState) => {
        console.log("sending previous state ", appState);
        win.webContents.send("set_previous_state_after_open", appState);
        if (isDev) {
          win.showInactive();
          win.minimize();
        } else {
          win.show();
          win.maximize();
        }
      })
      .catch((err) => {
        console.error(err);
      });
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

  ipcMain.on("save_before_closing", (e, appState) => {
    clearTimeout(closeAssuranceTimer);
    console.log("saving state ", appState);
    replaceDatabase(appState)
      .then(() => {
        win = null;
        console.log("recieve save-before-closing");
        // TODO do we need this if there is already a events listener for all windows closed?
        if (process.platform !== "darwin") {
          app.quit();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

  ipcMain.handle("start_gate", (event, config) => {
    return startGate(config);
  });

  ipcMain.handle("stop_gate", () => {
    return stopGate();
  });

  ipcMain.handle("read_file", (event, filePath) => {
    return fs.readFile(filePath, "utf-8");
  });
};
