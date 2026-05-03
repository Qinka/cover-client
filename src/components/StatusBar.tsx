export type StatusType = 'info' | 'success' | 'error';

export interface StatusMessage {
  type: StatusType;
  text: string;
}

interface StatusBarProps {
  message: StatusMessage | null;
}

const icons: Record<StatusType, string> = {
  info: 'ℹ️',
  success: '✅',
  error: '❌',
};

export function StatusBar({ message }: StatusBarProps) {
  if (!message) return null;

  return (
    <div
      style={{
        padding: '10px 16px',
        background: message.type === 'error' ? '#2a0a0a' : message.type === 'success' ? '#0a2a0a' : '#0a1a2a',
        borderRadius: 6,
        color: message.type === 'error' ? '#ff6b6b' : message.type === 'success' ? '#6bff6b' : '#88ccff',
        fontSize: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span>{icons[message.type]}</span>
      <span>{message.text}</span>
    </div>
  );
}
