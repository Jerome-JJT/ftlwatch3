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


export function GroupPermissionsPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('Groups permissisons page');}, []);

  const changePermission = useCallback((userId: number, groupId: number, value: boolean): Promise<boolean> => {
    return axios
      .post('/?page=admin&action=perm_set',
        `groupId=${userId}&permId=${groupId}&value=${value}`, { withCredentials: true }
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
      .get('/?page=admin&action=perms_get',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setColumns(res.data.columns as ColumnProps[]);

          const displayValues = res.data.values.map((groupWithPerms: any) => {
            res.data.columns.forEach((col: ColumnProps) => {
              if (col.field !== 'id' && col.field !== 'name') {
                groupWithPerms[col.field] = <Checkbox
                  id={`${groupWithPerms.id}-${col.field}`}
                  defaultChecked={groupWithPerms[col.field]}
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={async (e: any) => {
                    if (!(await changePermission(groupWithPerms.id, parseInt(col.field), e.target.checked))) {
                      e.target.checked = !e.target.checked;
                    }
                  }}
                />;
              }
            });

            return groupWithPerms;
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
          tableTitle='Permissions'
          options={[10, 20, 30]}
          reloadFunction={() => { setValues([]); }}
        />
      }
    </div>
  );
}
