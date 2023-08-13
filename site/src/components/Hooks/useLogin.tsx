import axios from 'axios';
import React from 'react';
import { type LoggedUserDto } from '../../_dtos/LoggedUser.dto';
import { AxiosErrorText } from './AxiosErrorText';

export interface UseLoginDto {
  logged: boolean
  setLogged: React.Dispatch<React.SetStateAction<boolean>>

  userInfos: LoggedUserDto | undefined
  userPages: any[] | undefined
  logout: () => void

  getUserData: () => void
}

const useLogin = (): UseLoginDto => {
  const [logged, setLogged] = React.useState(false);
  const [userInfos, setUserInfos] = React.useState<LoggedUserDto | undefined>();
  const [userPages, setUserPages] = React.useState<any[]>([]);

  // const getUsers = async () => {

  //   const data = await axios.get(`/api/users/`,
  //     { withCredentials: true, },
  //   )
  //     .then((api_response) => {

  //       return api_response.data

  //     })
  //     .catch((error) => {

  //       return AxiosErrorText(error);
  //     });

  //   return data;
  // };

  const getUserData = React.useCallback(() => {
    axios
      .get('/?page=login&action=me',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          setLogged(true);
          setUserInfos(res.data.user as LoggedUserDto);
          setUserPages(res.data.pages as any[]);
        }
      })
      .catch((error) => {
        setLogged(false);
        setUserInfos({} as LoggedUserDto);
        return AxiosErrorText(error);
      });
  }, []);

  const logout = React.useCallback(() => {
    axios
      .get('/?page=login&action=logout',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 204) {
          setLogged(false);
          setUserInfos({} as LoggedUserDto);
        }
      })
      .catch((error) => {
        return AxiosErrorText(error);
      });
  }, []);

  React.useEffect(() => {
    if (!logged) {
      getUserData();
    }
  }, [getUserData, logged]);

  return {
    logged,
    setLogged,
    userInfos,
    userPages,
    getUserData,
    logout
  };
};

export default useLogin;
