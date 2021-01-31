const { showOpenDialog, createWindow } = require("./helpers");
const { app, Menu, BrowserWindow } = require("electron");
const initFlash = require("./init-flash");

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

let pathToOpen = null;

let appIsReady = false;

initFlash();

app.on("open-file", (event, file) => {
  event.preventDefault();

  if (appIsReady) {
    const newWindow = createWindow();

    newWindow.loadURL(`file://${file}`);

    const contents = newWindow.webContents;
    contents.on("did-finish-load", () => {
      contents.insertCSS("html, body { height: 100vh; width: 100vw; }");
    });
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

    const contents = newWindow.webContents;
    contents.on("did-finish-load", () => {
      contents.insertCSS("html, body { height: 100vh; width: 100vw; }");
    });
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
