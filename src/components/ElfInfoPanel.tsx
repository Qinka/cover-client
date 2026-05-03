import type { ElfInfo } from '../types/cover.ts';

interface ElfInfoPanelProps {
  info: ElfInfo | null;
  fileName: string | null;
}

export function ElfInfoPanel({ info, fileName }: ElfInfoPanelProps) {
  if (!info) {
    return (
      <div style={{ padding: 16, color: '#888', fontStyle: 'italic' }}>
        No ELF file loaded. Drop a file above to see its metadata.
      </div>
    );
  }

  return (
    <div style={{ padding: 16, background: '#1a1a2e', borderRadius: 8 }}>
      <div style={{ marginBottom: 12, fontWeight: 600, color: '#e0e0e0' }}>
        {fileName}
      </div>
      <table style={{ width: '100%', fontSize: 14, color: '#ccc' }}>
        <tbody>
          <tr>
            <td style={{ color: '#888', paddingRight: 16 }}>Architecture</td>
            <td>{info.arch}</td>
          </tr>
          <tr>
            <td style={{ color: '#888', paddingRight: 16 }}>Type</td>
            <td>{info.elf_type}</td>
          </tr>
          <tr>
            <td style={{ color: '#888', paddingRight: 16 }}>Entry Point</td>
            <td>0x{info.entry.toString(16)}</td>
          </tr>
          <tr>
            <td style={{ color: '#888', paddingRight: 16 }}>Size</td>
            <td>{info.size.toLocaleString()} bytes</td>
          </tr>
          <tr>
            <td style={{ color: '#888', paddingRight: 16 }}>64-bit</td>
            <td>{info.is_64bit ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td style={{ color: '#888', paddingRight: 16 }}>Little Endian</td>
            <td>{info.is_little_endian ? 'Yes' : 'No'}</td>
          </tr>
          {info.is_packed && (
            <tr style={{ color: '#ff6b6b' }}>
              <td colSpan={2} style={{ paddingTop: 8 }}>
                ⚠️ This binary is already packed with COVER001
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
