import React from "react";
import LogoInconnu from "../../assets/img/inconnu.jpeg";
import { Link } from "react-router-dom";
import { UseLoginDto } from "../Hooks/useLogin";
import { Avatar, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";
import { AiFillSetting, AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import classNames from "classnames";

interface ProfileButtonProps {
  loginer: UseLoginDto;
}

export default function ProfileButton({
  loginer,
}: ProfileButtonProps) {

  const buttonColor = "bg-[#CCCCCC]"
  const textColor = "text-black"

  return (
    <Menu>
      <MenuHandler>
        <Avatar
          variant="circular"
          alt={`${loginer.userInfos && loginer.userInfos.login || ''}`}
          className="cursor-pointer"
          src={(loginer.logged &&
              loginer.userInfos &&
              loginer.userInfos.avatar_url) ||
            LogoInconnu
          }
        />
      </MenuHandler>
  
      <MenuList>
        {loginer.logged && loginer.userInfos && (
          <>
              <Typography variant="small" className="font-normal">
                {loginer.userInfos.login || ''}
              </Typography>
              <Typography variant="small" className="font-normal">
                {loginer.userInfos.display_name || ''}
              </Typography>
            <hr className="my-2 border-blue-gray-50" />
          </>
        )}

        {loginer.logged && (

          <>
            <Link to={"/settings"}>
            <MenuItem className={classNames("flex items-center gap-2", buttonColor)}>
              <AiFillSetting className={classNames(textColor)} />

              <Typography variant="small" className={classNames("font-normal", textColor)}>
                Settings
              </Typography>
            </MenuItem>
            </Link>

            <hr className="my-2 border-blue-gray-50" />

              <Link to={"/logout"}>
              <MenuItem className={classNames("flex items-center gap-2", buttonColor)}>
                <AiOutlineLogin className={classNames(textColor)} />

                <Typography variant="small" className={classNames("font-normal", textColor)}>
                  Logout
                </Typography>
              </MenuItem>
              </Link>
          </>

        ) || (
          <a href={`${import.meta.env.VITE_API_PREFIX}/?page=login&action=authorizeapi`}>

          <MenuItem className={classNames("flex items-center gap-2", buttonColor)}>
            <AiOutlineLogout className={classNames(textColor)} />

            <Typography variant="small" className={classNames("font-normal", textColor)}>
              Login api
            </Typography>
          </MenuItem>
          </a>
        )}

      </MenuList>
    </Menu>

    // <Menu>
    //   <div className="flex items-center md:order-2">
    //   <MenuHandler>
    //   <button
    //     type="button"
    //     onClick={handleClick}
    //     className="mr-3 rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 md:mr-0"
    //     id="user-menu-button"
    //   >
    //     <img
    //       className="h-8 w-8 justify-end rounded-full object-cover md:h-10 md:w-10"
    //       src={
    //         (loginer.logged &&
    //           loginer.userInfos &&
    //           loginer.userInfos.avatar_url) ||
    //         LogoInconnu
    //       }
    //       alt={`${loginer.userInfos?.pseudo}`}
    //     />
    //   </button>
    //   </MenuHandler>
      
    //   <MenuList>

    //   {openedMenu === "profile" && (
    //     <div
    //       className="absolute top-20 right-2 z-50 w-40 list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow-lg dark:divide-gray-600 dark:bg-gray-700"
    //       id="user-dropdown"
    //       ref={ref}
    //       >
    //       <List>

    //       <ListItem>
    //         <ListItemPrefix>
    //           <AiFillSetting/>
    //         </ListItemPrefix>
    //         Settings
    //       </ListItem>

    //       {
    //         loginer.logged === true && (
    //           <ListItem>
    //             <ListItemPrefix>
    //               <AiOutlineLogin/>
    //             </ListItemPrefix>
    //             Login intra
    //           </ListItem>
    //         ) || (
    //         <ListItem>
    //           <ListItemPrefix>
    //             <AiOutlineLogout/>
    //           </ListItemPrefix>
    //           Log Out
    //         </ListItem>
    //         )
    //       }

    //     </List>
    //     </div>
    //   )}
    //   </MenuList>
    // </div>
    // </Menu>
    
  );
}
