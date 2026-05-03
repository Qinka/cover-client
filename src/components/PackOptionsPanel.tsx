import type { LibcType } from '../types/cover.ts';

interface PackOptionsPanelProps {
  compressionLevel: number;
  onCompressionChange: (level: number) => void;
  libc: LibcType;
  onLibcChange: (libc: LibcType) => void;
  disabled?: boolean;
}

export function PackOptionsPanel({
  compressionLevel,
  onCompressionChange,
  libc,
  onLibcChange,
  disabled,
}: PackOptionsPanelProps) {
  return (
    <div style={{ padding: 16, background: '#1a1a2e', borderRadius: 8 }}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, color: '#888', fontSize: 13 }}>
          Compression Level: <span style={{ color: '#e0e0e0' }}>{compressionLevel}</span>
        </label>
        <input
          type="range"
          min={1}
          max={22}
          value={compressionLevel}
          onChange={(e) => onCompressionChange(Number(e.target.value))}
          disabled={disabled}
          style={{ width: '100%', accentColor: '#4f9eff' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#555' }}>
          <span>Faster</span>
          <span>Smaller</span>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 4, color: '#888', fontSize: 13 }}>Libc</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['musl', 'gnu'] as LibcType[]).map((t) => (
            <button
              key={t}
              onClick={() => onLibcChange(t)}
              disabled={disabled}
              style={{
                flex: 1,
                padding: '6px 0',
                background: libc === t ? '#4f9eff' : '#2a2a3e',
                color: libc === t ? '#fff' : '#888',
                border: 'none',
                borderRadius: 4,
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontWeight: libc === t ? 600 : 400,
              }}
            >
              {t === 'musl' ? 'musl (static)' : 'gnu (dynamic)'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
