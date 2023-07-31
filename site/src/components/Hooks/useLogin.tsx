import axios from "axios";
import React from "react";
import { LoggedUserDto } from "../../_dtos/useLogin.dto";
import { AxiosErrorText } from "./AxiosErrorText";



export interface UseLoginDto {
  logged: boolean;
  setLogged: Function;

  userInfos: LoggedUserDto | undefined;
  logout: Function,

  getUserData: Function;
}


const useLogin = (): UseLoginDto => {
  const [logged, setLogged] = React.useState(false);
  const [userInfos, setUserInfos] = React.useState<LoggedUserDto | undefined>();

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
      .get("/?page=login&action=me", 
      { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          setLogged(true);
          setUserInfos(res.data.user as LoggedUserDto);
          return;
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
        .get("/?page=login&action=logout", 
        { withCredentials: true, }
        )
        .then((res) => {
          if (res.status === 204) {
            setLogged(false);
            setUserInfos({} as LoggedUserDto);
            return;
          }
        })
        .catch((error) => {
          return AxiosErrorText(error);
        });

  }, []);


  React.useEffect(() => {
    if (logged === false) {
      getUserData();
    }
  }, [getUserData, logged]);

  return {
    logged,
    setLogged,
    userInfos,
    getUserData,
    logout,
  };
};

export default useLogin;
