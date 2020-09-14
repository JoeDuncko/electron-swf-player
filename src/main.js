const { app, BrowserWindow, dialog, protocol } = require("electron");
const path = require("path");
var flashTrust = require("nw-flash-trust");

// appName could be any globally unique string containing only
// big and small letters, numbers and chars "-._"
// It specifies name of file where trusted paths will be stored.
// Best practice is to feed it with "name" value from your package.json file.
var appName = "myApp";

// Initialization and parsing config file for given appName (if already exists).
var trustManager = flashTrust.initSync(appName);

let mainWindow;

app.on("window-all-closed", function () {
  if (process.platform != "darwin") app.quit();
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

let ppapi_flash_path;

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

console.log("__dirname", __dirname);

app.commandLine.appendSwitch("ppapi-flash-path", ppapi_flash_path);

// Specify flash version, for example, v18.0.0.203
app.commandLine.appendSwitch("ppapi-flash-version", "18.0.0.203");

app.on("ready", function () {
  protocol.registerFileProtocol("file", (request, callback) => {
    const pathname = decodeURI(request.url.replace("file:///", ""));
    callback(pathname);
  });

  trustManager.add(`file:///Users/joeduncko/Downloads/f/BeepBeep.swf`);

  var isTrusted = trustManager.isTrusted(
    `file:///Users/joeduncko/Downloads/f/BeepBeep.swf`
  );
  console.log("is trusted", isTrusted);

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      plugins: true,
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  // mainWindow.loadURL(
  //   "http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html"
  // );

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // dialog.showOpenDialog({ properties: ["openFile"] }).then((test) => {
  //   // adds given filepath to trusted locations
  //   // paths must be absolute
  //   // trustManager.add(`file:///Users/joeduncko/Downloads/f/BeepBeep.swf`);
  //   mainWindow.webContents.send("change", `file://${test.filePaths[0]}`);
  //   // mainWindow.webContents.send("change", `https://i.4cdn.org/f/HNNNNNG.swf`)
  // });
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
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
