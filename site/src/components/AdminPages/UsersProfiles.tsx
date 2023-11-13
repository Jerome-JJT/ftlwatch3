import React, { useCallback } from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Button,
  Dialog,
  DialogBody,
} from '@material-tailwind/react';
import { SuperTable } from 'Common/SuperTable';
import { useNotification } from 'Notifications/NotificationsProvider';
import { ColumnProps } from 'Utils/columnsProps';
import { commonTitle } from 'Utils/commonTitle';
import { AiOutlineClose } from 'react-icons/ai';
import { UserProfileModify } from './UserProfileModify';
import { ThemeProps } from 'Utils/themeProps';



export function UsersProfilesPage(): JSX.Element {
  const { addNotif } = useNotification();
  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  const [themes, setThemes] = React.useState<ThemeProps[] | undefined>(undefined);
  const [focusedProfile, setFocusedProfile] = React.useState<any[] | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('User profiles page');}, []);

  const changePermission = useCallback((userId: number, value: boolean): Promise<boolean> => {
    return axios
      .post('/?page=admin&action=user_set',
        `userId=${userId}&value=${value}`, { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          // localStorage.setItem('token', res.data.access_token);
        } //
        return true;
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
        return false;
      });
  }, [addNotif]);

  React.useEffect(() => {
    axios
      .get('/?page=admin&action=profiles_get',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setColumns(res.data.columns as ColumnProps[]);
          setThemes(res.data.themes as ThemeProps[]);


          const displayValues = res.data.values.map((user: any) => {
            res.data.columns.forEach((col: ColumnProps) => {

              if (col.field === 'avatar_url') {
                user[col.field] = <img
                  src={user[col.field]}
                  alt={user.login}
                  className='max-h-full max-w-[60px] rounded-lg'
                />;
              }
              else if (col.field === 'modify') {

                user[col.field] = <Button
                  onClick={() => setFocusedProfile(user)}
                >
                  Modify
                </Button>;
              }
              // else if (col.field === 'hidden') {

              //   user[col.field] = <Checkbox
              //     id={`${user.id}-${col.field}`}
              //     defaultChecked={user[col.field]}
              //     onClick={async (e: any) => {
              //       if (!(await changePermission(user.id, e.target.checked))) {
              //         e.target.checked = !e.target.checked;
              //       }
              //     }}
              //   />;
              // }
            });

            return user;
          });
          setValues(displayValues);
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif, changePermission]);


  return (
    <div className='my-content'>
      {(columns && values) &&
        <SuperTable
          columns={columns}
          values={values}
          tableTitle='User profiles'
          options={[10, 20, 30]}
          // reloadFunction={() => { setValues([]); }}
        />
      }
      <Dialog className='dark:bg-gray-600' open={focusedProfile !== undefined} handler={() => setFocusedProfile(undefined)}>
        <div className="flex items-center justify-end p-2 pr-4">
          <AiOutlineClose onClick={() => setFocusedProfile(undefined)}
            className='rounded-lg border-transparent border-2 hover:bg-gray-100 hover:border-black hover:text-red-500' size='30' />
        </div>
        <DialogBody className='flex justify-center border-t'>
          <UserProfileModify themes={themes} profile={focusedProfile} />
        </DialogBody>
      </Dialog>
    </div>
  );
}
