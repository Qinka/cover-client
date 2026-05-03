/**
 * Browser-side file save using Blob + Object URL download.
 * Works in any modern browser without needing Electron's IPC.
 */
export async function fileSave(data: ArrayBuffer, defaultName: string): Promise<boolean> {
  const blob = new Blob([data], { type: 'application/octet-stream' });
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
