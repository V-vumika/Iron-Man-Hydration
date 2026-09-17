const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let popup = null;

// ---- Config ----
const REMINDER_INTERVAL_MS =
  process.env.NODE_ENV === 'development'
    ? 15 * 1000
    : 30 * 60 * 1000;

const SNOOZE_MS = 5 * 60 * 1000;

// Window size — popup.html er layout ei size er upor base kora
const WIN_WIDTH = 820;
const WIN_HEIGHT = 560;

let intervalHandle = null;


// ---- Create Popup ----
function createPopup() {
  if (popup && !popup.isDestroyed()) {
    popup.show();
    return;
  }

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  popup = new BrowserWindow({
    width: WIN_WIDTH,
    height: WIN_HEIGHT,

    x: width - WIN_WIDTH - 10,
    y: height - WIN_HEIGHT - 10,

    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    transparent: true,
    hasShadow: false,
    backgroundColor: '#00000000',

    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  popup.loadFile(path.join(__dirname, 'popup.html'));

  popup.on('closed', () => {
    popup = null;
  });
}


// ---- Reminder System ----
function scheduleReminders() {
  if (intervalHandle) {
    clearInterval(intervalHandle);
  }

  intervalHandle = setInterval(
    createPopup,
    REMINDER_INTERVAL_MS
  );
}


// ---- App Ready ----
app.whenReady().then(() => {

  setTimeout(createPopup, 5000);

  scheduleReminders();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createPopup();
    }
  });
});


// ---- Keep App Running ----
app.on('window-all-closed', (e) => {
  e.preventDefault();
});


// ---- DRANK Button ----
ipcMain.on('hydration:drank', () => {
  if (popup && !popup.isDestroyed()) {
    popup.close();
  }
});


// ---- SNOOZE Button ----
ipcMain.on('hydration:snooze', () => {
  if (popup && !popup.isDestroyed()) {
    popup.close();
  }

  setTimeout(createPopup, SNOOZE_MS);
});
