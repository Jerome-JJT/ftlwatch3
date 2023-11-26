import axios from 'axios';
import { useContext, type ReactNode, createContext, useCallback, useState } from 'react';
import { AxiosErrorText } from './AxiosErrorText';
import { useNotification } from 'Notifications/NotificationsProvider';

export interface LoggedUser {
  id: number

  login: string
  display_name: string

  avatar_url: string

  is_admin: boolean

  theme_id: number
  theme_image: string
  theme_color: string
  terms: boolean
  citation: string
  citation_avatar: string
}

interface GetUserDataProps {
  announce?: boolean
  reload?: boolean
}

interface LoginContextProps {
  isLogged: boolean
  userInfos: LoggedUser | undefined
  userPages: any[]
  getUserData: (options?: GetUserDataProps) => void
  logout: () => void
}

const LoginContext = createContext<LoginContextProps | undefined>(undefined);

export function useLogin(): LoginContextProps {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error('useLogin must be used within a LoginProvider');
  }
  return context;
}

export function LoginProvider({ children }: { children: ReactNode }): JSX.Element {
  const { addNotif } = useNotification();

  const [isLogged, setIsLogged] = useState(false);
  const [userInfos, setUserInfos] = useState<LoggedUser | undefined>();
  const [userPages, setUserPages] = useState<any[]>([]);

  const getUserData = useCallback(({ announce = false, reload = false }: GetUserDataProps = {}) => {
    axios
      .get(`/?page=me&action=get${reload ? '&reload=true' : ''}`,
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setIsLogged(true);
          setUserInfos(res.data.user as LoggedUser);
          setUserPages(res.data.pages as any[]);
          if (announce) {
            addNotif(`Welcome ${res.data.user.login}!`, 'success');
          }
          else if (reload) {
            addNotif('Reload done', 'info');
          }
        }
      })
      .catch((error) => {
        setIsLogged(false);
        setUserInfos({} as LoggedUser);
        if (announce) {
          addNotif(AxiosErrorText(error), 'error');
        }
        return AxiosErrorText(error);
      });
  }, [addNotif]);

  const logout = useCallback(() => {
    axios
      .get('/?page=login&action=logout',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 204) {
          setIsLogged(false);
          const saveLogin = userInfos?.login;
          setUserInfos({} as LoggedUser);
          setUserPages([]);
          if (saveLogin) {
            addNotif(`Goodbye ${saveLogin}!`, 'success');
          }
        }
      })
      .catch((error) => {
        return AxiosErrorText(error);
      });
  }, [addNotif, userInfos?.login]);

  return (
    <LoginContext.Provider
      value={{
        isLogged,
        userInfos,
        userPages,
        getUserData,
        logout,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
