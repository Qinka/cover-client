interface ActionButtonsProps {
  canAnalyze: boolean;
  canPack: boolean;
  isPacking: boolean;
  onAnalyze: () => void;
  onPack: () => void;
}

export function ActionButtons({ canAnalyze, canPack, isPacking, onAnalyze, onPack }: ActionButtonsProps) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <button
        onClick={onAnalyze}
        disabled={!canAnalyze}
        style={{
          flex: 1,
          padding: '10px 0',
          background: canAnalyze ? '#2a2a3e' : '#1a1a2e',
          color: canAnalyze ? '#e0e0e0' : '#555',
          border: '1px solid #4f9eff',
          borderRadius: 6,
          cursor: canAnalyze ? 'pointer' : 'not-allowed',
          fontWeight: 600,
          fontSize: 15,
        }}
      >
        Analyze
      </button>
      <button
        onClick={onPack}
        disabled={!canPack || isPacking}
        style={{
          flex: 1,
          padding: '10px 0',
          background: canPack && !isPacking ? '#4f9eff' : '#1a2a3e',
          color: canPack && !isPacking ? '#fff' : '#555',
          border: 'none',
          borderRadius: 6,
          cursor: canPack && !isPacking ? 'pointer' : 'not-allowed',
          fontWeight: 600,
          fontSize: 15,
        }}
      >
        {isPacking ? 'Packing…' : 'Pack ELF'}
      </button>
    </div>
  );
}
