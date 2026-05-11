import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 720,
    height: 800,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'cover — ELF Packer',
    autoHideMenuBar: true,
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    const rendererPath = join(__dirname, '../../dist-renderer/index.html');
    if (!existsSync(rendererPath)) {
      throw new Error(`Renderer entry not found: ${rendererPath}`);
    }
    mainWindow.loadFile(rendererPath);
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC: open file dialog → return file bytes
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: [{ name: 'ELF Binaries', extensions: ['elf', 'bin', 'out'] }],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  const filePath = result.filePaths[0]!;
  const data = readFileSync(filePath);
  return { filePath, data: data.buffer };
});

// IPC: save file dialog → write bytes to chosen path
ipcMain.handle('dialog:saveFile', async (_event, data: ArrayBuffer, defaultName: string) => {
  const result = await dialog.showSaveDialog(mainWindow!, {
    defaultPath: defaultName,
    filters: [{ name: 'ELF Binaries', extensions: ['elf', 'bin', 'out'] }],
  });
  if (result.canceled || !result.filePath) return false;
  writeFileSync(result.filePath, Buffer.from(data));
  return true;
});
