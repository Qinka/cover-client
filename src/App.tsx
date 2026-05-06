import { useState, useEffect, useCallback } from 'react';
import { FileDropZone } from './components/FileDropZone.tsx';
import { ElfInfoPanel } from './components/ElfInfoPanel.tsx';
import { PackOptionsPanel } from './components/PackOptionsPanel.tsx';
import { ActionButtons } from './components/ActionButtons.tsx';
import { StatusBar, type StatusMessage } from './components/StatusBar.tsx';
import { useCoverWasm } from './hooks/useCoverWasm.ts';
import type { ElfInfo, LibcType } from './types/cover.ts';
import { saveOutputFile } from './webFileSave.ts';
import './App.css';

declare global {
  interface Window {
    electron: {
      openFile: () => Promise<{ filePath: string; data: ArrayBuffer } | null>;
      saveFile: (data: ArrayBuffer, defaultName: string) => Promise<boolean>;
    };
  }
}

function App() {
  const [elfData, setElfData] = useState<Uint8Array | null>(null);
  const [elfName, setElfName] = useState<string | null>(null);
  const [elfInfo, setElfInfo] = useState<ElfInfo | null>(null);
  const [compressionLevel, setCompressionLevel] = useState(3);
  const [libc, setLibc] = useState<LibcType>('musl');
  const [statusMsg, setStatusMsg] = useState<StatusMessage | null>(null);
  const [isPacking, setIsPacking] = useState(false);

  const { initWasm, analyzeElf, packElf, status } = useCoverWasm();

  useEffect(() => {
    initWasm();
  }, [initWasm]);

  const setStatus = useCallback((msg: StatusMessage) => {
    setStatusMsg(msg);
  }, []);

  const handleFileSelected = useCallback((data: Uint8Array, name: string) => {
    setElfData(data);
    setElfName(name);
    setElfInfo(null);
    setStatus({ type: 'info', text: `Loaded ${name} (${data.byteLength.toLocaleString()} bytes)` });
  }, [setStatus]);

  const handleAnalyze = useCallback(async () => {
    if (!elfData) return;
    try {
      const info = await analyzeElf(elfData);
      setElfInfo(info);
      setStatus({
        type: 'info',
        text: `Analyzed: ${info.arch} ${info.elf_type}, entry=0x${info.entry.toString(16)}`,
      });
    } catch (e) {
      setStatus({ type: 'error', text: e instanceof Error ? e.message : 'Analysis failed' });
    }
  }, [elfData, analyzeElf, setStatus]);

  const handlePack = useCallback(async () => {
    if (!elfData) return;
    setIsPacking(true);
    try {
      const packed = await packElf(elfData, compressionLevel, libc);
      const saveName = elfName ? `${elfName}.packed` : 'output.packed';
      const ok = await saveOutputFile(packed, saveName);
      if (ok) {
        setStatus({ type: 'success', text: `Packed ELF saved (${packed.byteLength.toLocaleString()} bytes)` });
      } else {
        setStatus({ type: 'info', text: 'Save cancelled' });
      }
    } catch (e) {
      setStatus({ type: 'error', text: e instanceof Error ? e.message : 'Packing failed' });
    } finally {
      setIsPacking(false);
    }
  }, [elfData, elfName, compressionLevel, libc, packElf, setStatus]);

  const isReady = status === 'ready';
  const canAnalyze = isReady && elfData !== null && !isPacking;
  const canPack = isReady && elfData !== null && elfInfo !== null && !elfInfo.is_packed && !isPacking;

  return (
    <div className="app">
      <header className="app-header">
        <h1>cover</h1>
        <p>ELF Packer — zstd compression with stub injection</p>
      </header>

      <main className="app-main">
        <FileDropZone onFileSelected={handleFileSelected}  />

        <ElfInfoPanel info={elfInfo} fileName={elfName} />

        <PackOptionsPanel
          compressionLevel={compressionLevel}
          onCompressionChange={setCompressionLevel}
          libc={libc}
          onLibcChange={setLibc}
          disabled={!isReady || isPacking}
        />

        <ActionButtons
          canAnalyze={canAnalyze}
          canPack={canPack}
          isPacking={isPacking}
          onAnalyze={handleAnalyze}
          onPack={handlePack}
        />

        <StatusBar message={statusMsg} />
      </main>
    </div>
  );
}

export default App;

