export interface UserDto {
  id: number;

  login_name: string;
  pseudo: string;

  status: string;

  avatar_url: string;
  is_admin: boolean;
  color: number;
}
