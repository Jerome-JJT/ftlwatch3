import LogoInconnu from '../../assets/img/inconnu.jpeg';
import { Link } from 'react-router-dom';
import { Avatar, Menu, MenuHandler, MenuItem, MenuList, Typography } from '@material-tailwind/react';
import { AiFillSetting, AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai';
import classNames from 'classnames';
import { useLogin } from 'Hooks/LoginProvider';

export default function ProfileButton (): JSX.Element {
  const buttonColor = 'bg-[#CCCCCC]'
  const textColor = 'text-black'
  const { isLogged, userInfos } = useLogin();

  return (
    <Menu>
      <MenuHandler>
        <Avatar
          variant="circular"
          alt={`${userInfos?.login ?? ''}`}
          className="cursor-pointer"
          src={(isLogged &&
              userInfos &&
              userInfos.avatar_url) ||
            LogoInconnu
          }
        />
      </MenuHandler>

      <MenuList>
        {isLogged && userInfos && (
          <>
              <Typography variant="small" className="font-normal">
                {userInfos.login || ''}
              </Typography>
              <Typography variant="small" className="font-normal">
                {userInfos.display_name || ''}
              </Typography>
            <hr className="my-2 border-blue-gray-50" />
          </>
        )}

        {(isLogged && (

          <>
            <Link to={'/settings'}>
            <MenuItem className={classNames('flex items-center gap-2', buttonColor)}>
              <AiFillSetting className={classNames(textColor)} />

              <Typography variant="small" className={classNames('font-normal', textColor)}>
                Settings
              </Typography>
            </MenuItem>
            </Link>

            <hr className="my-2 border-blue-gray-50" />

              <Link to={'/logout'}>
              <MenuItem className={classNames('flex items-center gap-2', buttonColor)}>
                <AiOutlineLogin className={classNames(textColor)} />

                <Typography variant="small" className={classNames('font-normal', textColor)}>
                  Logout
                </Typography>
              </MenuItem>
              </Link>
          </>

        )) || (
          <a href={`${import.meta.env.VITE_API_PREFIX}/?page=login&action=authorizeapi`}>

          <MenuItem className={classNames('flex items-center gap-2', buttonColor)}>
            <AiOutlineLogout className={classNames(textColor)} />

            <Typography variant="small" className={classNames('font-normal', textColor)}>
              Login api
            </Typography>
          </MenuItem>
          </a>
        )}

      </MenuList>
    </Menu>

  );
}
