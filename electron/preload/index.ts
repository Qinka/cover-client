import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  openFile: (): Promise<{ filePath: string; data: ArrayBuffer } | null> =>
    ipcRenderer.invoke('dialog:openFile'),

  saveFile: (data: ArrayBuffer, defaultName: string): Promise<boolean> =>
    ipcRenderer.invoke('dialog:saveFile', data, defaultName),
});
