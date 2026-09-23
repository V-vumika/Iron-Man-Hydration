const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('hydration', {
  drank: () => ipcRenderer.send('hydration:drank'),
  snooze: () => ipcRenderer.send('hydration:snooze'),

  openSettings: () => ipcRenderer.send('settings:open'),
  closeSettings: () => ipcRenderer.send('settings:close'),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (minutes) => ipcRenderer.invoke('settings:save', minutes),
});