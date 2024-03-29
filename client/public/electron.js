const { app, BrowserWindow, shell } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

// runs gate event listeners

// process.env.ELECTRON_FORCE_WINDOW_MENU_BAR = true;
// process.env.ELECTRON_OVERRIDE_DIST_PATH =

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS;

if (isDev) {
  const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
    },
    // makes startup smoother to show win later
    show: false,
    /** see for below https://www.electronjs.org/docs/faq#the-font-looks-blurry-what-is-this-and-what-can-i-do
     */
    backgroundColor: "#fff",
  });

  // Load from localhost if in development
  // Otherwise load index.html file
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // initialize hl7gate and all business logic routes
  const gateControls = require(path.join(__dirname, "./main/hl7Gate"))(win);
  require(path.join(__dirname, "./main/ipcRoutes"))(win, gateControls);

  // any new windows that are opened (ie with a web link) open in default browser
  win.webContents.on("new-window", (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });

  // Open DevTools if in dev mode
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

// Create a new browser window by invoking the createWindow
// function once the Electron application is initialized.
// Install REACT_DEVELOPER_TOOLS as well if isDev
app.whenReady().then(() => {
  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred: , ${error}`));
  }

  createWindow();
});

// Add a new listener that tries to quit the application when
// it no longer has any open windows. This listener is a no-op
// on macOS due to the operating system's window management behavior.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Add a new listener that creates a new browser window only if
// when the application has no visible windows after being activated.
// For example, after launching the application for the first time,
// or re-launching the already running application.
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// The code above has been adapted from a starter example in the Electron docs:
// https://www.electronjs.org/docs/tutorial/quick-start#create-the-main-script-file
