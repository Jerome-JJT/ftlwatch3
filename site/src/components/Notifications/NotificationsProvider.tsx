import { type ReactNode, createContext, useContext, useState } from 'react';

export interface Notification {
  id: number
  text: string
  type: string
  expiring: boolean
  open: boolean
}

interface NotificationContextProps {
  notifications: Notification[]
  addNotif: (text: string, alertType: string, expires?: number) => void
  removeNotif: (id: number) => void
}

// Create a context to hold the notifications
const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

// Create a custom hook to use the context
export function useNotification (): NotificationContextProps {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

// NotificationProvider component
export function NotificationProvider ({ children }: { children: ReactNode }): JSX.Element {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Function to add a new notification
  const addNotif = (content: string, alertType: string, expires: number = 10): void => {
    const newNotif = {
      id: Date.now(), // You can use a unique identifier like a timestamp
      text: content,
      type: alertType,
      expiring: expires > 0,
      open: true
    };

    // Add the new notification to the state
    setNotifications(old => {
      if (old.filter(notif => notif.expiring).length >= 5) {
        return [...old.filter(notif => notif.id !== old.find(n => n.expiring)?.id), newNotif];
      }
      return [...old, newNotif]
    });

    if (expires) {
      setTimeout(() => {
        removeNotif(newNotif.id);
      }, 1000 * expires);
    }
  };

  // Function to remove a notification by its ID
  const removeNotif = (id: number): void => {
    setNotifications(old => {
      const toCloseNotif = old.findIndex((notif) => notif.id === id);

      if (toCloseNotif !== -1) {
        old[toCloseNotif].open = false;
      }
      return [...old];
    });

    setTimeout(() => {
      setNotifications(old => old.filter(notif => notif.id !== id));
    }, 200);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotif,
        removeNotif
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
