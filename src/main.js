const { showOpenDialog, createWindow } = require("./helpers");
const { app, Menu, BrowserWindow } = require("electron");
const path = require("path");

const { menuTemplate } = require("./menuTemplate");

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

app.on("window-all-closed", function () {
  if (process.platform != "darwin") app.quit();
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

let ppapi_flash_path;

let pathToOpen = null;

let appIsReady = false;

// Specify flash path.
// On Windows, it might be /path/to/pepflashplayer.dll
// On OS X, /path/to/PepperFlashPlayer.plugin
// On Linux, /path/to/libpepflashplayer.so
if (process.platform == "win32") {
  ppapi_flash_path = path.join(__dirname, "pepflashplayer.dll");
} else if (process.platform == "linux") {
  ppapi_flash_path = path.join(__dirname, "libpepflashplayer.so");
} else if (process.platform == "darwin") {
  ppapi_flash_path = path.join(
    __dirname,
    "/pepper/mac/PepperFlashPlayer.plugin"
  );
}

app.commandLine.appendSwitch("ppapi-flash-path", ppapi_flash_path);

// Specify flash version, for example, v18.0.0.203
app.commandLine.appendSwitch("ppapi-flash-version", "32.0.0.433");

app.on("open-file", (event, file) => {
  event.preventDefault();

  if (appIsReady) {
    const newWindow = createWindow();

    newWindow.loadURL(`file://${file}`);
  } else {
    pathToOpen = file;
  }
});

app.on("ready", function () {
  appIsReady = true;
  // Only open the dialog if it's not open yet
  if (!pathToOpen) {
    showOpenDialog();
  } else {
    const newWindow = createWindow();

    newWindow.loadURL(`file://${pathToOpen}`);
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    showOpenDialog();
  }
});
