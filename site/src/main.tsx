import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './main.css'
// import { ThemeProvider } from '@material-tailwind/react';
import { NotificationProvider } from './components/Notifications/NotificationsProvider.tsx';
import { LoginProvider } from './components/Hooks/LoginProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  // <ThemeProvider>
  <NotificationProvider>
    <LoginProvider>
      <App />
    </LoginProvider>
  </NotificationProvider>
  // </ThemeProvider>
  // </React.StrictMode>,
)
