const { app, BrowserWindow } = require("electron");
const path = require("path");

const createWindow = () => {
  const win = new BrowserWindow({
    // width: 1900,
    // height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  win.maximize();
  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
});
