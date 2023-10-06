import {
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
} from '@material-tailwind/react';
import { AiFillCaretDown, AiFillCaretUp, AiFillHome, AiFillStar, AiOutlineClose } from 'react-icons/ai';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from 'Hooks/LoginProvider';

interface NavBarProps {
  openedMenu: string
  setOpenedMenu: React.Dispatch<React.SetStateAction<string>>
}

// const screens = [
//   {
//     label: 'Home', url: 'Home'
//   },
//   {
//     label: 'Testing',
//     list: [
//       { label: 'Tests', url: 'Tests', icon: 'caretRight' },
//       { label: 'Permissions', url: 'Permissions' },
//       { label: 'User_Permissions', url: 'UserPermissions' },
//       { label: 'Groups', url: 'Groups' },
//       { label: 'Screen1', url: 'Screen1' }
//     ]
//   },
//   { label: 'Users', url: 'Users' },
//   { label: 'Images', url: 'Images' }
// ]

export default function LeftDrawer({
  openedMenu,
  setOpenedMenu,
}: NavBarProps): JSX.Element {
  const { userPages } = useLogin();

  const changeSub = (subId: number): void => {
    if (subId === selectedSub) {
      subId = -1;
    }

    setSelectedSub(subId);
  };

  const [selectedSub, setSelectedSub] = React.useState(-1);
  const navigate = useNavigate();

  function createDrawer(): any {
    return userPages?.flatMap((elem, id) => {
      return ([

        <ListItem key={`${id}`}
          onClick={() => {
            (elem.list && elem.list.length > 0)
              ? changeSub(id)
              : (elem.basefilter ? navigate(`${elem.route}?${elem.basefilter}`) : navigate(`${elem.route}`));
          }}>
          <ListItemPrefix>
            {
              (
                (
                  (elem.list && elem.list.length > 0 && selectedSub === id) &&
                  <AiFillCaretUp />
                ) ||

                (
                  elem.list && elem.list.length > 0 &&
                <AiFillCaretDown />)
              ) ||

              <AiFillStar />
            }
          </ListItemPrefix>

          {(elem.name && elem.name) || ''}
        </ListItem>,

        elem.list?.map((sub: any, subId: number) => {
          return (
            selectedSub === id &&
            <ListItem className="ml-4" key={`${id}_${subId}`} onClick={() => {
              sub.basefilter ? navigate(`${sub.route}?${sub.basefilter}`) : navigate(`${sub.route}`);
            }}>

              <ListItemPrefix>
                <AiFillStar />
              </ListItemPrefix>

              {(sub.name && sub.name) || ''}

            </ListItem>
          );
        }),

        (id < (userPages || []).length - 1) && <hr key={`sep_${id}`} className="my-2 border-blue-gray-200" />,

      ]);
    });
  }

  return (
    <Drawer open={openedMenu === 'leftdrawer'} onClose={() => { setOpenedMenu(''); }} className="p-4">
      <div className="mb-2 flex items-center justify-between p-4">
        <Typography variant="h5" color="blue-gray">
          Menu
        </Typography>
        <IconButton variant="text" color="blue-gray" onClick={() => { setOpenedMenu(''); }}>
          <AiOutlineClose />
        </IconButton>
      </div>

      <List>

        <ListItem key={'home'} onClick={() => { navigate('/'); }}>
          <ListItemPrefix>
            <AiFillHome />
          </ListItemPrefix>

          {'Home'}
        </ListItem>
        <hr key={'sep_home'} className="my-2 border-blue-gray-200" />

        {createDrawer()}

      </List>
    </Drawer>
  );
}
