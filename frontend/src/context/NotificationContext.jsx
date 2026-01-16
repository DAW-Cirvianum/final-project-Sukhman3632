import { useState, useCallback } from 'react';
import { NotificationContext } from './NotificationContext.js';

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    
    setNotifications(prev => [...prev, { id, message, type }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, [removeNotification]);

  // Shortcut methods
  const showSuccess = useCallback((msg) => addNotification(msg, 'success'), [addNotification]);
  const showError = useCallback((msg) => addNotification(msg, 'error'), [addNotification]);
  const showInfo = useCallback((msg) => addNotification(msg, 'info'), [addNotification]);
  const showWarning = useCallback((msg) => addNotification(msg, 'warning'), [addNotification]);
  

  const showNotification = useCallback((msg, type = 'info') => addNotification(msg, type), [addNotification]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      showSuccess,
      showError,
      showInfo,
      showWarning,
      showNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
