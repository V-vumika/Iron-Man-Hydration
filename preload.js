const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('hydration', {
  drank: () => ipcRenderer.send('hydration:drank'),
  snooze: () => ipcRenderer.send('hydration:snooze'),
});
