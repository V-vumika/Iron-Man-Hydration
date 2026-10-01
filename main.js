const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');

let popup = null;
let settingsWin = null;

// ---- Config ----
const SNOOZE_MS = 5 * 60 * 1000;
const DEFAULT_REMINDER_MINUTES = 30;

const SETTINGS_PATH = path.join(app.getPath('userData'), 'settings.json');
let reminderMinutes = DEFAULT_REMINDER_MINUTES;

// Window size — matches the popup.html layout
const WIN_WIDTH = 820;
const WIN_HEIGHT = 560;

let activeTimer = null; // Stores the single active reminder timer used by both DRANK and SNOOZE


// ---- Settings persistence ----
function loadSettings() {
  try {
    const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8');
    const data = JSON.parse(raw);
    if (typeof data.reminderMinutes === 'number' && data.reminderMinutes > 0) {
      reminderMinutes = data.reminderMinutes;
    }
  } catch (err) {
   // File is missing or corrupted — keep the default value (30)
  }
}

function saveSettingsToDisk() {
  try {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify({ reminderMinutes }));
  } catch (err) {
    console.error('Settings save failed:', err);
  }
}

function getReminderMs() {
  return reminderMinutes * 60 * 1000;
}


// ---- Single-timer scheduler (prevents multiple timers from running) ----
function clearActiveTimer() {
  if (activeTimer) {
    clearTimeout(activeTimer);
    activeTimer = null;
  }
}

function scheduleNextReminder(ms) {
  clearActiveTimer(); // Stop the previous timer before starting a new one
  activeTimer = setTimeout(() => {
    activeTimer = null;
    createPopup();
  }, ms);
}


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


// ---- Create Settings Window ----
function createSettingsWindow() {
  if (settingsWin && !settingsWin.isDestroyed()) {
    settingsWin.show();
    settingsWin.focus();
    return;
  }

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const winW = 340;
  const winH = 300;

  settingsWin = new BrowserWindow({
    width: winW,
    height: winH,
    x: Math.round((width - winW) / 2),
    y: Math.round((height - winH) / 2),

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

  settingsWin.loadFile(path.join(__dirname, 'settings.html'));

  settingsWin.on('closed', () => {
    settingsWin = null;
  });
}


// ---- App Ready ----
app.whenReady().then(() => {
  loadSettings();

  setTimeout(createPopup, 5000);

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
  if (settingsWin && !settingsWin.isDestroyed()) {
    settingsWin.close();
  }
  scheduleNextReminder(getReminderMs());
});


// ---- SNOOZE Button ----
ipcMain.on('hydration:snooze', () => {
  if (popup && !popup.isDestroyed()) {
    popup.close();
  }
  scheduleNextReminder(SNOOZE_MS);
});


// ---- Settings IPC ----
ipcMain.on('settings:open', () => {
  createSettingsWindow();
});

ipcMain.on('settings:close', () => {
  if (settingsWin && !settingsWin.isDestroyed()) {
    settingsWin.close();
  }
});

ipcMain.handle('settings:get', () => {
  return { reminderMinutes };
});

ipcMain.handle('settings:save', (event, minutes) => {
  const n = Number(minutes);
  if (Number.isFinite(n) && n > 0) {
    reminderMinutes = n;
    saveSettingsToDisk();
  }
  return { ok: true, reminderMinutes };
});