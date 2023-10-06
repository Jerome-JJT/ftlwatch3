import axios from 'axios';
import React, { useContext, type ReactNode, createContext } from 'react';
import { AxiosErrorText } from './AxiosErrorText';
import { useNotification } from 'Notifications/NotificationsProvider';

export interface LoggedUser {
  id: number

  login: string
  display_name: string

  avatar_url: string

  is_admin: boolean
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

  const [isLogged, setIsLogged] = React.useState(false);
  const [userInfos, setUserInfos] = React.useState<LoggedUser | undefined>();
  const [userPages, setUserPages] = React.useState<any[]>([]);

  const getUserData = React.useCallback(({ announce = false, reload = false }: GetUserDataProps = {}) => {
    axios
      .get(`/?page=login&action=me${reload ? '&reload=true' : ''}`,
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

  const logout = React.useCallback(() => {
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

// export interface UseLoginDto {
//   logged: boolean
//   setLogged: React.Dispatch<React.SetStateAction<boolean>>

//   userInfos: LoggedUserDto | undefined
//   userPages: any[] | undefined
//   logout: () => void

//   getUserData: () => void
// }

// const useLogin = (): UseLoginDto => {
//   const { addNotif } = useNotification();
//   const [logged, setLogged] = React.useState(false);
//   const [userInfos, setUserInfos] = React.useState<LoggedUserDto | undefined>();
//   const [userPages, setUserPages] = React.useState<any[]>([]);

//   // const getUsers = async () => {

//   //   const data = await axios.get(`/api/users/`,
//   //     { withCredentials: true, },
//   //   )
//   //     .then((api_response) => {

//   //       return api_response.data

//   //     })
//   //     .catch((error) => {

//   //       return AxiosErrorText(error);
//   //     });

//   //   return data;
//   // };

//   const getUserData = React.useCallback(() => {
//     axios
//       .get('/?page=login&action=me',
//         { withCredentials: true }
//       )
//       .then((res) => {
//         if (res.status === 200) {
//           console.log(res.data);
//           setLogged(true);
//           setUserInfos(res.data.user as LoggedUserDto);
//           setUserPages(res.data.pages as any[]);
//           addNotif(res.data.use.login, 'error');
//         }
//       })
//       .catch((error) => {
//         setLogged(false);
//         setUserInfos({} as LoggedUserDto);
//         addNotif(AxiosErrorText(error), 'error');
//         return AxiosErrorText(error);
//       });
//   }, []);

//   const logout = React.useCallback(() => {
//     axios
//       .get('/?page=login&action=logout',
//         { withCredentials: true }
//       )
//       .then((res) => {
//         if (res.status === 204) {
//           setLogged(false);
//           setUserInfos({} as LoggedUserDto);
//           setUserPages({} as any);
//         }
//       })
//       .catch((error) => {
//         return AxiosErrorText(error);
//       });
//   }, []);

//   React.useEffect(() => {
//     if (!logged) {
//       getUserData();
//     }
//   }, [getUserData, logged]);

//   return {
//     logged,
//     setLogged,
//     userInfos,
//     userPages,
//     getUserData,
//     logout
//   };
// };

// export default useLogin;
