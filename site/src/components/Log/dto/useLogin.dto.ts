import { MutableRefObject } from "react";
import { UserDto } from "src/_shared_dto/user.dto";

export interface LoggedUserDto {
  id: number;
  login_name: string;
  pseudo: string;

  color: number;
  avatar_url: string;

  tfa_enabled: boolean;
  is_admin: boolean;

  asked: number[];
  friends: number[];
  blockeds: number[];
}

export interface UseLoginDto {
  logged: boolean;
  setLogged: Function;
  // userInfos: User

  token: string;
  setToken: Function;

  userInfos: LoggedUserDto | undefined;

  get_headers: Function;

  getUserData: Function;

  tfaUserId: MutableRefObject<number>;
}
