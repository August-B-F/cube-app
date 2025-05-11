const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('search-file', async (event, fileName, directoryPath) => {
  const possibleExtensions = ['.mp3', '.mp4', '.txt', '.pdf', '.jpg', '.png', '.html']; 

  for (const ext of possibleExtensions) {
    const filePath = path.join(directoryPath, fileName + ext);
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      return { exists: true, path: filePath };
    } catch (error) {
    }
  }

  return { exists: false };
});

ipcMain.handle('load-file-content', async (event, filePath) => {
  try {
    const stats = await fs.promises.stat(filePath);
    const fileType = path.extname(filePath).toLowerCase();
    
    if (['.mp3', '.mp4', '.jpg', '.png', '.pdf'].includes(fileType)) {
      // For binary files, just return the file path
      return { type: fileType, path: filePath };
    } else if (['.txt', '.html'].includes(fileType)) {
      // For text and HTML files, read the content
      const content = await fs.promises.readFile(filePath, 'utf-8');
      console.log(content)
      return { type: fileType, content };
    } else {
      return { type: 'unsupported' };
    }
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
});

ipcMain.handle('load-explanation', async (event, projectCode, it) => {
  const explanationPath = path.join(__dirname, 'assets', 'explanations', `${projectCode}.txt`);
  try {
    if (it === true) {
      var content = await fs.promises.readFile(__dirname+"/assets/explanations_it/"+projectCode+".txt", 'utf-8');
      content = content.replace(/"/g, '');
      return content;
    } else {
      var content = await fs.promises.readFile(__dirname+"/assets/explanations/"+projectCode+".txt", 'utf-8');
      content = content.replace(/"/g, '');
      return content;
  }
  } catch (error) {
    return null;
  }
});