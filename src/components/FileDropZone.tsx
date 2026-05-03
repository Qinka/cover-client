import { useState, useCallback, useRef } from 'react';

interface FileDropZoneProps {
  onFileSelected: (data: Uint8Array, name: string) => void;
  disabled?: boolean;
}

export function FileDropZone({ onFileSelected, disabled }: FileDropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file) return;
    file.arrayBuffer().then((buf) => {
      onFileSelected(new Uint8Array(buf), file.name);
    }).catch((e) => {
      console.error('Failed to read file:', e);
    });
  }, [onFileSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    e.target.value = '';
  }, [handleFile]);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".elf,.bin,.out,application/x-elf"
        onChange={handleInputChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{
          border: `2px dashed ${dragging ? '#4f9eff' : '#555'}`,
          borderRadius: 8,
          padding: 32,
          textAlign: 'center',
          background: dragging ? '#1a2a3a' : 'transparent',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 8 }}>📁</div>
        <div>Drop an ELF file here, or click to browse</div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Supports x86_64 and aarch64 ELF binaries</div>
      </div>
    </>
  );
}
