 //Notification 


import { useNotification } from '../hooks/useNotification';

export default function Notification() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  const styles = {
    success: { bg: '#10b981', icon: '✓' },
    error: { bg: '#ef4444', icon: '✕' },
    info: { bg: '#3b82f6', icon: 'ℹ' },
    warning: { bg: '#f59e0b', icon: '⚠' },
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '400px',
      }}
    >
      {notifications.map((notif) => {
        const style = styles[notif.type] || styles.info;

        return (
          <div
            key={notif.id}
            role="status"
            style={{
              background: style.bg,
              color: 'white',
              padding: '16px 20px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {style.icon}
            </span>

            <span style={{ flex: 1 }}>{notif.message}</span>

            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => removeNotification(notif.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0 4px',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        );
      })}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
