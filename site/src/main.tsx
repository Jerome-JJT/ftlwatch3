import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './main.css';
// import { ThemeProvider } from '@material-tailwind/react';
import { NotificationProvider } from './components/Notifications/NotificationsProvider.tsx';
import { LoginProvider } from './components/Hooks/LoginProvider.tsx';
import { ThemeProvider } from '@material-tailwind/react';
import { theme } from './tailwind.theme.ts';





// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <ThemeProvider value={theme}>
    <NotificationProvider>
      <LoginProvider>
        <App />
      </LoginProvider>
    </NotificationProvider>
  </ThemeProvider>
  // </React.StrictMode>,
);
