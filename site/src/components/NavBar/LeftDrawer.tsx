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


  const [selectedSubs, setSelectedSubs] = React.useState<number[]>([]);
  const navigate = useNavigate();


  const changeSub = React.useCallback((subId: number): void => {

    if (selectedSubs.indexOf(subId) === -1) {
      setSelectedSubs((prev) => {
        return [...prev, subId];
      });
    }
    else {
      setSelectedSubs((prev) => {
        return prev.filter((v) => v !== subId);
      });
    }
  }, [selectedSubs]);

  const createDrawer = React.useMemo((): any => {

    return userPages?.flatMap((elem, id) => {
      return ([

        <ListItem key={`${id}`}
          className='hover:dark:bg-blue-gray-900 focus:dark:bg-blue-gray-900 active:dark:bg-blue-gray-900 '
          onClick={() => {
            (elem.list && elem.list.length > 0)
              ? changeSub(id)

              : (elem.route.startsWith('http') ? window.location = elem.route :
                (elem.basefilter ? navigate(`${elem.route}?${elem.basefilter}`) : navigate(`${elem.route}`)));
          }}>
          <ListItemPrefix>
            {
              (
                (
                  (elem.list && elem.list.length > 0 && selectedSubs.indexOf(id) === -1) &&
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
            (selectedSubs.indexOf(id) !== -1) &&
            <ListItem key={`${id}_${subId}`}
              className='ml-4 hover:dark:bg-blue-gray-900 focus:dark:bg-blue-gray-900 active:dark:bg-blue-gray-900'
              onClick={() => {
                sub.route.startsWith('http') ? window.location = sub.route :
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
  }, [changeSub, navigate, selectedSubs, userPages]);

  return (
    <Drawer
      open={openedMenu === 'leftdrawer'}
      onClose={() => { setOpenedMenu(''); }}
      className="p-4 dark:text-white dark:bg-gray-600 overflow-y-scroll"
      overlayProps={{ className: 'fixed' }}
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

        {createDrawer}

      </List>
    </Drawer>
  );
}
