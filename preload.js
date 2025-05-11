const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  searchFile: (fileName, directoryPath) => ipcRenderer.invoke('search-file', fileName, directoryPath),
  loadFileContent: (filePath) => ipcRenderer.invoke('load-file-content', filePath),
  loadExplanation: (projectCode, it) => ipcRenderer.invoke('load-explanation', projectCode, it)
});