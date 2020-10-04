const { BrowserWindow, dialog, protocol } = require("electron");

const showOpenDialog = () => {
  dialog.showOpenDialog({ properties: ["openFile"] }).then((event) => {
    if (event.filePaths[0]) {
      const newWindow = createWindow();

      newWindow.loadURL(`file://${event.filePaths[0]}`);
    }
  });
};

const createWindow = () => {
  protocol.registerFileProtocol("file", (request, callback) => {
    const pathname = decodeURI(request.url.replace("file:///", ""));
    callback(pathname);
  });

  return new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      plugins: true,
      nodeIntegration: true,
      webSecurity: false,
    },
  });
};

exports.showOpenDialog = showOpenDialog;
exports.createWindow = createWindow;
