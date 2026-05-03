import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { fileSave } from './webFileSave.ts';

window.electron = {
  openFile: async () => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.elf,.bin,out,application/x-elf';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) { resolve(null); return; }
        const data = await file.arrayBuffer();
        resolve({ filePath: file.name, data });
      };
      input.click();
    });
  },
  saveFile: async (data: ArrayBuffer, defaultName: string) => {
    return fileSave(data, defaultName);
  },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
