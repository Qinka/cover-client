function toBlobPart(data: ArrayBuffer | ArrayBufferView): BlobPart {
  if (ArrayBuffer.isView(data)) {
    return data.byteOffset === 0 && data.byteLength === data.buffer.byteLength
      ? data.buffer
      : data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  }

  return data;
}

/**
 * Browser-side file save using Blob + Object URL download.
 * Works in any modern browser without needing Electron's IPC.
 */
export async function fileSave(data: ArrayBuffer | ArrayBufferView, defaultName: string): Promise<boolean> {
  const blob = new Blob([toBlobPart(data)], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = defaultName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return true;
}

export async function saveOutputFile(data: ArrayBuffer | ArrayBufferView, defaultName: string): Promise<boolean> {
  if (typeof window !== 'undefined' && typeof window.electron?.saveFile === 'function') {
    const payload = ArrayBuffer.isView(data)
      ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
      : data;

    return window.electron.saveFile(payload, defaultName);
  }

  return fileSave(data, defaultName);
}
