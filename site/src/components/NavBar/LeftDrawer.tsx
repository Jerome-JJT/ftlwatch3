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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                  clipRule="evenodd"
                />
              </svg>
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
