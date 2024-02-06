import React, { useCallback } from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Checkbox,
} from '@material-tailwind/react';
import { SuperTable } from 'Common/SuperTable';
import { useNotification } from 'Notifications/NotificationsProvider';
import { ColumnProps } from 'Utils/columnsProps';
import { commonTitle } from 'Utils/commonTitle';



export function UsersVisibilityPage(): JSX.Element {
  const { addNotif } = useNotification();
  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('User visibility page');}, []);

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
      .get('/?page=admin&action=users_get',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setColumns(res.data.columns as ColumnProps[]);

          const displayValues = res.data.values.map((user: any) => {
            res.data.columns.forEach((col: ColumnProps) => {

              if (col.field === 'avatar_url') {
                user[col.field] = <img
                  src={user[col.field]}
                  alt={user.login}
                  className='max-h-full max-w-[60px] rounded-lg'
                />;
              }
              else if (col.field === 'hidden') {

                user[`_${col.field}`] = user[col.field].toString();

                user[col.field] = <Checkbox crossOrigin={undefined}
                  id={`${user.id}-${col.field}`}
                  defaultChecked={user[col.field]}
                  onClick={async (e: any) => {
                    if (!(await changePermission(user.id, e.target.checked))) {
                      e.target.checked = !e.target.checked;
                    }
                  }}
                />;
              }
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
          tableTitle='Poolfilters'
          options={[10, 20, 30]}
          // reloadFunction={() => { setValues([]); }}
        />
      }
    </div>
  );
}
