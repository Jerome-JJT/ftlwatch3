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


export function UserGroupsPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('User groups page');}, []);

  const changePermission = useCallback((userId: number, groupId: number, value: boolean): Promise<boolean> => {
    return axios
      .post('/?page=admin&action=group_set',
        `userId=${userId}&groupId=${groupId}&value=${value}`, { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          // addNotif('teest2', 'question', false);
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
      .get('/?page=admin&action=groups_get',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setColumns(res.data.columns as ColumnProps[]);

          const displayValues = res.data.values.map((userWithGroups: any) => {

            res.data.columns.forEach((col: ColumnProps) => {
              if (col.field !== 'id' && col.field !== 'login') {
                userWithGroups[`_${col.field}`] = userWithGroups[col.field];
                userWithGroups[col.field] = <Checkbox crossOrigin={undefined}
                  id={`${userWithGroups.id}-${col.field}`}
                  defaultChecked={userWithGroups[col.field]}
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={async (e: any) => {
                    if (!(await changePermission(userWithGroups.id, parseInt(col.field), e.target.checked))) {
                      e.target.checked = !e.target.checked;
                    }
                  }}
                />;
              }
            });

            return userWithGroups;
          });
          setValues(displayValues);
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif, changePermission]);

  //
  return (
    <div className='my-content'>
      {(columns && values) &&
        <SuperTable
          columns={columns}
          values={values}
          tableTitle='User groups'
          options={[10, 20, 30]}
          // reloadFunction={() => { setValues([]); }}
        />
      }
    </div>
  );
}
