import React from 'react';
import { type UseLoginDto } from '../Hooks/useLogin';
import axios from 'axios';
import { AxiosErrorText } from '../Hooks/AxiosErrorText';
import {
  Checkbox
} from '@material-tailwind/react';
import { SuperTable } from '../Common/SuperTable';
import { useNotification } from '../Notifications/NotificationsProvider';

interface UserGroupsProps {
  loginer: UseLoginDto
}

class ColumnProps {
  field: string = ''
  label: string = ''
}

export function UserGroupsPage ({
  loginer
}: UserGroupsProps): JSX.Element {
  const { addNotif } = useNotification();

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  const changePermission = async (userId: number, groupId: number, value: boolean): Promise<boolean> => {
    return await axios
      .post('/?page=permissions&action=group_set',
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
  }

  React.useEffect(() => {
    axios
      .get('/?page=permissions&action=groups_get',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          if (res.data.values.length > 0) {
            setColumns(res.data.columns as ColumnProps[]);

            const displayValues = res.data.values.map((userWithGroups: any) => {
              console.log(userWithGroups, res.data.columns);

              res.data.columns.forEach((col: ColumnProps) => {
                if (col.field !== 'id' && col.field !== 'login') {
                  userWithGroups[col.field] = <Checkbox
                    id={`${userWithGroups.id}-${col.field}`}
                    defaultChecked={userWithGroups[col.field]}
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={async (e: any) => {
                      if (!(await changePermission(userWithGroups.id, parseInt(col.field), e.target.checked))) {
                        e.target.checked = !e.target.checked;
                      }
                    }}
                  />
                }
              })

              return userWithGroups
            })
            setValues(displayValues);
          }
          else {
            addNotif('No results found', 'error');
          }
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [])

  //
  return (
    <div className='mx-8 mt-2'>
      {(columns && values) &&
        <SuperTable
          columns={columns}
          values={values}
          tableTitle='Groups'
          options={[10, 20, 30]}
          reloadFunction={() => { setValues([]) }}
        />
      }
    </div>
  );
}
