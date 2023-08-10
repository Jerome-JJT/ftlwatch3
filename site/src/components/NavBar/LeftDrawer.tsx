import {
  Drawer,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip
} from "@material-tailwind/react";
import { AiFillHeart, AiOutlineClose } from 'react-icons/ai';

import { UseLoginDto } from "../Hooks/useLogin";

interface NavBarProps {
  loginer: UseLoginDto;
  openedMenu: string;
  setOpenedMenu: Function;
}



// const screens = [
//   {
//     label: "Home", url: "Home",
//     icon: <MaterialCommunityIcons name={"home-variant-outline"} size={globalStyles.drawerTxt.fontSize + 4} color={globalStyles.drawerTxt.color} />
//   },
//   {
//     label: "Testing",
//     list: [
//       { label: "Tests", url: "Tests", icon: 'caretRight' },
//       { label: "Permissions", url: "Permissions" },
//       { label: "User_Permissions", url: "UserPermissions" },
//       { label: "Groups", url: "Groups" },
//       { label: "Screen1", url: "Screen1" },
//     ]
//   },
//   { label: "Users", url: "Users" },
//   { label: "Images", url: "Images" },
// ];



export default function LeftDrawer({
  loginer,
  openedMenu,
  setOpenedMenu,
}: NavBarProps) {
  
  return (
    <Drawer open={openedMenu === "leftdrawer"} onClose={() => setOpenedMenu("")} className="p-4">
        <div className="mb-2 flex items-center justify-between p-4">
          <Typography variant="h5" color="blue-gray">
            Side Menu
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setOpenedMenu("")}>
            <AiOutlineClose/>
          </IconButton>
        </div>
        <List>
          <ListItem>
            <ListItemPrefix>
              <AiFillHeart/>
            </ListItemPrefix>
            Dashboard
            <ListItemSuffix>
              <Chip
                value="14"
                size="sm"
                variant="ghost"
                color="blue-gray"
                className="rounded-full"
              />
            </ListItemSuffix>
          </ListItem>

        
          <ListItem>
            <ListItemPrefix>
              <FontAwesomeIcon icon="AiFillAlert"/>
            </ListItemPrefix>
            Settings
          </ListItem>
          <ListItem>
            <ListItemPrefix>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM6.166 5.106a.75.75 0 010 1.06 8.25 8.25 0 1011.668 0 .75.75 0 111.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 011.06 0z"
                  clipRule="evenodd"
                />
              </svg>
            </ListItemPrefix>
            Log Out
          </ListItem>
        </List>
      </Drawer>
  );
}
