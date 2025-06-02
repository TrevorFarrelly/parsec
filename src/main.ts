import { BrowserWindow, app } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { Option } from './options'
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let win: BrowserWindow;

function createWindow() {
  let { state, monitor } = Option.MonitorWindowState('main');
  win = new BrowserWindow({
    width: state.width,
    height: state.height,
    x: state.x,
    y: state.y,
    show: false, // Start hidden to prevent flicker
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.removeMenu();

  monitor(win);

  if (state.isFullscreen) {
    win.setFullScreen(true);
  } else if (state.isMaximized) {
    win.maximize();
  }

  // load index.html
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  win.webContents.openDevTools(); // Open DevTools for debugging
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  win.once('ready-to-show', () => {
    win.show(); // Show the window when it's ready to prevent flicker
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});