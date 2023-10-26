import {
  Drawer,
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
          className='hover:dark:bg-blue-gray-900 focus:dark:bg-blue-gray-900 active:dark:bg-blue-gray-900'
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
                  <AiFillCaretUp className='my-text' />
                ) ||

                (
                  elem.list && elem.list.length > 0 &&
                <AiFillCaretDown className='my-text' />)
              ) ||

              <AiFillStar className='my-text' />
            }
          </ListItemPrefix>

          <p>{(elem.name && elem.name) || ''}</p>
        </ListItem>,

        elem.list?.map((sub: any, subId: number) => {
          return (
            selectedSub === id &&
            <ListItem key={`${id}_${subId}`}
              className='ml-4 hover:dark:bg-blue-gray-900 focus:dark:bg-blue-gray-900 active:dark:bg-blue-gray-900'
              onClick={() => {
                sub.basefilter ? navigate(`${sub.route}?${sub.basefilter}`) : navigate(`${sub.route}`);
              }}>

              <ListItemPrefix>
                <AiFillStar className='my-text' />
              </ListItemPrefix>

              <p>{(sub.name && sub.name) || ''}</p>

            </ListItem>
          );
        }),

        (id < (userPages || []).length - 1) && <hr key={`sep_${id}`} className="my-2 border-blue-gray-200" />,

      ]);
    });
  }

  return (
    <Drawer
      open={openedMenu === 'leftdrawer'}
      onClose={() => { setOpenedMenu(''); }}
      className="p-4 dark:text-white dark:bg-gray-600"
    >
      <div className="mb-2 flex items-center justify-between p-4">
        <p className='text-xl font-bold'>
          Menu
        </p>
        <IconButton variant="text" onClick={() => { setOpenedMenu(''); }}>
          <AiOutlineClose size='24' />
        </IconButton>
      </div>

      <List className='text-none my-text'>

        <ListItem key={'home'}
          className='hover:dark:bg-blue-gray-900 focus:dark:bg-blue-gray-900 active:dark:bg-blue-gray-900'
          onClick={() => { navigate('/'); }}
        >
          <ListItemPrefix>
            <AiFillHome className='my-text' />
          </ListItemPrefix>

          <p>Home</p>
        </ListItem>
        <hr key={'sep_home'} className="my-2 border-blue-gray-200" />

        {createDrawer()}

      </List>
    </Drawer>
  );
}
