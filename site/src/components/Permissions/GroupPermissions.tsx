import React from 'react';
import axios from 'axios';
import { AxiosErrorText } from '../Hooks/AxiosErrorText';
import {
  Checkbox
} from '@material-tailwind/react';
import { SuperTable } from '../Common/SuperTable';
import { useNotification } from '../Notifications/NotificationsProvider';

class ColumnProps {
  field: string = ''
  label: string = ''
}

export function GroupPermissionsPage (): JSX.Element {
  const { addNotif } = useNotification();
  // const [searchParams] = useSearchParams();
  // const defaultFilter = searchParams.get('filter');

  // const [pageError, setPageError] = React.useState<string | undefined>(undefined);

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  const changePermission = async (userId: number, groupId: number, value: boolean): Promise<boolean> => {
    return await axios
      .post('/?page=permissions&action=perm_set',
        `groupId=${userId}&permId=${groupId}&value=${value}`, { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          // localStorage.setItem('token', res.data.access_token);
        } //
        return true;
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error')
        return false;
      });
  }

  React.useEffect(() => {
    axios
      .get('/?page=permissions&action=perms_get',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          if (res.data.values.length > 0) {
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
                  />
                }
              })

              return groupWithPerms
            })
            setValues(displayValues);
            // setPageError(undefined);
          }
          else {
            addNotif('No results found', 'error')
          }
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error')
      });
  }, [])

  //
  return (
    <div className='mx-8 mt-2'>
      {(columns && values) &&
        <SuperTable
          columns={columns}
          values={values}
          tableTitle='Permissions'
          options={[10, 20, 30]}
          reloadFunction={() => { setValues([]) }}
        />
      }
    </div>
  );
}
